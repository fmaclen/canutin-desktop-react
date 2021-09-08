import { screen, waitFor } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';

import App from '@components/App';
import { AppCtxProvider } from '@app/context/appContext';
import { DATABASE_CONNECTED } from '@constants';
import { DB_NEW_ACCOUNT } from '@constants/events';

import { render } from '@tests/utils';

describe('Add account by Hand tests', () => {
  beforeEach(() => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testFilePath' });
      }

      return ipcRenderer;
    });
    render(
      <AppCtxProvider>
        <App />
      </AppCtxProvider>
    );

    const addAccountsOrAssetsButton = screen.getByText('Add or update data').closest('a');

    if (addAccountsOrAssetsButton) {
      userEvent.click(addAccountsOrAssetsButton);
    }
    const onCreateNewAccountByHand = screen.getByRole('button', { name: /By hand/i });
    userEvent.click(onCreateNewAccountByHand);
    const addAccountByHandOptions = screen.getByLabelText('Account');
    userEvent.click(addAccountByHandOptions);
  });

  test('Create new account only with required fields', async () => {
    const addAccountsOrAssetsButton = screen.getByText('Add or update data').closest('a');
    expect(screen.getByRole('form')).toHaveFormValues({});
    expect(addAccountsOrAssetsButton).toHaveAttribute('href', '/account/addAccountOrAsset');

    await selectEvent.select(screen.getByLabelText('Account type'), 'Checking');

    // Required fields
    const nameInput = screen.getByLabelText('Name');
    const autoCalculateInput = screen.getByLabelText('Auto-calculate from transactions');

    const continueButton = screen.getByRole('button', { name: /Continue/i });
    expect(continueButton).toBeDisabled();

    userEvent.type(nameInput, 'Test account');
    userEvent.click(autoCalculateInput);
    await waitFor(() => {
      expect(nameInput).toHaveValue('Test account');
      expect(autoCalculateInput).toBeChecked();
      expect(continueButton).not.toBeDisabled();
    });

    userEvent.click(autoCalculateInput);
    await waitFor(() => {
      expect(continueButton).toBeDisabled();
    });
    userEvent.click(autoCalculateInput);
    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
    });
    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(continueButton);
    await waitFor(() => {
      expect(spySendIpcRenderer).toBeCalledWith(DB_NEW_ACCOUNT, {
        accountType: 'checking',
        autoCalculate: true,
        balance: null,
        institution: '',
        name: 'Test account',
        officialName: '',
      });
    });
  });

  test('Create new account with optional fields', async () => {
    const addAccountsOrAssetsButton = screen.getByText('Add or update data').closest('a');
    expect(screen.getByRole('form')).toHaveFormValues({});
    expect(addAccountsOrAssetsButton).toHaveAttribute('href', '/account/addAccountOrAsset');

    await selectEvent.select(screen.getByLabelText('Account type'), 'PayPal');
    const nameInput = screen.getByLabelText('Name');
    const officialNameInput = screen.getByLabelText('Official name / Optional');
    const institutionInput = screen.getByLabelText('Institution / Optional');
    const balanceInput = screen.getByLabelText('Balance');
    const continueButton = screen.getByRole('button', { name: /Continue/i });

    expect(continueButton).toBeDisabled();

    // Fill inputs
    userEvent.type(nameInput, 'Test Account');
    userEvent.type(officialNameInput, 'Test Official Name');
    userEvent.type(institutionInput, 'Test Institution');
    userEvent.type(balanceInput, '123');

    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
      expect(nameInput).toHaveValue('Test Account');
      expect(officialNameInput).toHaveValue('Test Official Name');
      expect(institutionInput).toHaveValue('Test Institution');
      expect(balanceInput).toHaveValue('+$123');
    });

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(continueButton);
    await waitFor(() => {
      expect(spySendIpcRenderer).toBeCalledWith(DB_NEW_ACCOUNT, {
        accountType: 'paypal',
        autoCalculate: false,
        balance: '123',
        institution: 'Test Institution',
        name: 'Test Account',
        officialName: 'Test Official Name',
      });
    });
  });
});
