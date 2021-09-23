import { screen, waitFor } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import userEvent from '@testing-library/user-event';

import App from '@components/App';
import { AppCtxProvider } from '@app/context/appContext';
import { StatusBarProvider } from '@app/context/statusBarContext';
import { DATABASE_CONNECTED } from '@constants';
import canutinLinkApi, { ApiEndpoints, requestLinkSummary } from '@app/data/canutinLink.api';

import { render } from '@tests/utils';

describe('CanutinLink tests', () => {
  beforeEach(() => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testFilePath' });
      }

      return ipcRenderer;
    });
    render(
      <AppCtxProvider>
        <StatusBarProvider>
          <App />
        </StatusBarProvider>
      </AppCtxProvider>
    );

    const linkSidebarButton = screen.getByText('Link').closest('a');
    if (linkSidebarButton) {
      userEvent.click(linkSidebarButton);
    }
  });

  test('User can login', async () => {
    const linkSidebarButton = screen.getByText('Link').closest('a');
    expect(linkSidebarButton).toHaveAttribute('href', '/link');
    expect(screen.getByRole('form')).toHaveFormValues({});

    const spyCanutinLinkApi = jest.spyOn(canutinLinkApi, 'post');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    const loginErrorMessage = 'No matching login';
    const passwordErrorMessage = 'Invalid password';
    const networkErrorMessage =
      "Couldn't connect to Canutin's server, check your internet connection or try syncing again later";

    // Test field errors are properly displayed
    userEvent.type(emailInput, 'wrong@example.com');
    userEvent.type(passwordInput, 'secret');

    spyCanutinLinkApi.mockRejectedValueOnce({
      response: {
        status: 401,
        data: {
          'field-error': ['login', 'no matching login'],
          error: 'There was an error logging in',
        },
      },
    });
    userEvent.click(loginButton);
    await waitFor(() => {
      expect(spyCanutinLinkApi).toBeCalledWith(ApiEndpoints.USER_LOGIN, {
        login: 'wrong@example.com',
        password: 'secret',
      });
      expect(screen.queryByText(networkErrorMessage)).not.toBeInTheDocument();
      expect(screen.queryByText(passwordErrorMessage)).not.toBeInTheDocument();
      expect(screen.queryByText(loginErrorMessage)).toBeVisible();
    });

    // Test wrong password response
    userEvent.clear(emailInput);
    userEvent.clear(passwordInput);
    userEvent.type(emailInput, 'alice@example.com');
    userEvent.type(passwordInput, 'wrong_secret');
    spyCanutinLinkApi.mockRejectedValueOnce({
      response: {
        status: 401,
        data: {
          'field-error': ['password', 'invalid password'],
          error: 'There was an error logging in',
        },
      },
    });
    userEvent.click(loginButton);
    await waitFor(() => {
      expect(spyCanutinLinkApi).toBeCalledWith(ApiEndpoints.USER_LOGIN, {
        login: 'alice@example.com',
        password: 'wrong_secret',
      });
      expect(screen.queryByText(loginErrorMessage)).not.toBeInTheDocument();
      expect(screen.queryByText(passwordErrorMessage)).toBeInTheDocument();
    });

    // Test user is alerted of a network error
    spyCanutinLinkApi.mockRejectedValueOnce(new Error('Network Error'));
    userEvent.click(loginButton);
    await waitFor(() => expect(screen.getByText(networkErrorMessage)).toBeInTheDocument());

    userEvent.click(screen.getByText('Dismiss'));
    await waitFor(() => {
      expect(screen.queryByText('Link institution')).not.toBeInTheDocument();
      expect(screen.queryByText(networkErrorMessage)).not.toBeInTheDocument();
    });

    // Test login is succesful
    userEvent.clear(emailInput);
    userEvent.clear(passwordInput);
    userEvent.type(emailInput, 'alice@example.com');
    userEvent.type(passwordInput, 'secret');
    spyCanutinLinkApi.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        data: {
          success: 'You have been logged in',
        },
      })
    );
    const spyRequestLinkSummary = jest.spyOn(canutinLinkApi, 'get');
    spyRequestLinkSummary.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        data: {
          email: 'alice@example.com',
          institutions: [],
          errors: {
            user: false,
            institution: false,
          },
        },
      })
    );
    userEvent.click(loginButton);
    await waitFor(() => {
      expect(screen.getByText('Link institution')).toBeVisible();
      expect(screen.queryByText(networkErrorMessage)).not.toBeInTheDocument();
      expect(screen.queryByText(passwordErrorMessage)).not.toBeInTheDocument();
      expect(screen.queryByText(loginErrorMessage)).not.toBeInTheDocument();
    });
  });
});
