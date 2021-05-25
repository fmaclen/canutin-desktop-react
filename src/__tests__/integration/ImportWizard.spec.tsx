import { screen, waitFor } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';

import App from '@components/App';
import { DATABASE_CONNECTED } from '@constants';
import {
  IMPORT_SOURCE_FILE,
  IMPORT_SOURCE_FILE_ACK,
  ANALYZE_SOURCE_FILE_ACK,
} from '@constants/events';
import canutinFile from '../data/canutinFile.json';
import csvMetadata from '../data/csvMetadata.json';
import csvSourceData from '../data/csvSourceData.json';

import { render } from '@tests/utils';
import { act } from 'react-dom/test-utils';

const initImportWizard = () => {
  render(<App />);

  const addAccountsOrAssetsButton = screen.getByText('Add accounts or assets').closest('a');

  if (addAccountsOrAssetsButton) {
    userEvent.click(addAccountsOrAssetsButton);
  }
  const onImportWizard = screen.getByRole('button', { name: /Import Wizard/i });
  userEvent.click(onImportWizard);
};

describe('Import Wizard tests', () => {
  test('Check import wizard options', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent);
      }

      return ipcRenderer;
    });

    initImportWizard();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    const canutinFileOption = screen.getByLabelText('CanutinFile (JSON)');
    const mintOption = screen.getByLabelText('Mint.com (CSV)');
    const personalCapitalOption = screen.getByLabelText('Personal Capital (CSV)');
    const otherCsvOption = screen.getByLabelText('Other CSV');

    userEvent.click(canutinFileOption);
    expect(canutinFileOption).toBeChecked();
    expect(mintOption).not.toBeChecked();
    expect(personalCapitalOption).not.toBeChecked();
    expect(otherCsvOption).not.toBeChecked();

    userEvent.click(mintOption);
    expect(canutinFileOption).not.toBeChecked();
    expect(mintOption).toBeChecked();
    expect(personalCapitalOption).not.toBeChecked();
    expect(otherCsvOption).not.toBeChecked();

    userEvent.click(personalCapitalOption);
    expect(canutinFileOption).not.toBeChecked();
    expect(mintOption).not.toBeChecked();
    expect(personalCapitalOption).toBeChecked();
    expect(otherCsvOption).not.toBeChecked();

    userEvent.click(otherCsvOption);
    expect(canutinFileOption).not.toBeChecked();
    expect(mintOption).not.toBeChecked();
    expect(personalCapitalOption).not.toBeChecked();
    expect(otherCsvOption).toBeChecked();
  });

  test('Import canutin file', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent);
      }

      return ipcRenderer;
    });

    initImportWizard();
    const canutinFileOption = screen.getByLabelText('CanutinFile (JSON)');
    userEvent.click(canutinFileOption);
    const chooseButton = screen.getByRole('button', { name: /Choose/i });
    const continueButton = screen.getByRole('button', { name: /Continue/i });

    expect(continueButton).not.toBeEnabled();
    expect(chooseButton).toBeEnabled();

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(chooseButton);
    expect(spySendIpcRenderer).toHaveBeenLastCalledWith(IMPORT_SOURCE_FILE, 'json');
  });

  test('Import Mint file', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent);
      }

      return ipcRenderer;
    });

    initImportWizard();
    const mintFileOption = screen.getByLabelText('Mint.com (CSV)');
    userEvent.click(mintFileOption);
    const chooseButton = screen.getByRole('button', { name: /Choose/i });
    const continueButton = screen.getByRole('button', { name: /Continue/i });

    expect(continueButton).not.toBeEnabled();
    expect(chooseButton).toBeEnabled();

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(chooseButton);
    expect(spySendIpcRenderer).toHaveBeenLastCalledWith(IMPORT_SOURCE_FILE, 'csv');
  });

  test('Import Personal capital file', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent);
      }

      return ipcRenderer;
    });

    initImportWizard();
    const personalCapitalOption = screen.getByLabelText('Personal Capital (CSV)');
    userEvent.click(personalCapitalOption);
    const chooseButton = screen.getByRole('button', { name: /Choose/i });
    const continueButton = screen.getByRole('button', { name: /Continue/i });

    expect(continueButton).not.toBeEnabled();
    expect(chooseButton).toBeEnabled();

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(chooseButton);
    expect(spySendIpcRenderer).toHaveBeenLastCalledWith(IMPORT_SOURCE_FILE, 'csv');
  });

  test('Import option with data source', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent);
      }

      if (event === IMPORT_SOURCE_FILE_ACK) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testPath' });
      }

      if (event === ANALYZE_SOURCE_FILE_ACK) {
        callback((event as unknown) as IpcRendererEvent, {
          status: 'success',
          sourceData: canutinFile,
          metadata: { countAccounts: 1, countTransactions: 1 },
        });
      }

      return ipcRenderer;
    });

    initImportWizard();
    const personalCapitalOption = screen.getByLabelText('Personal Capital (CSV)');
    userEvent.click(personalCapitalOption);
    expect(screen.getByText(/testpath/i)).not.toBeNull();
    expect(screen.getByText(/Found 1 accounts and 1 transactions in the file/i)).not.toBeNull();

    const chooseButton = screen.getByRole('button', { name: /Choose/i });
    expect(chooseButton).toBeEnabled();

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(chooseButton);
    expect(spySendIpcRenderer).toHaveBeenLastCalledWith(IMPORT_SOURCE_FILE, 'csv');
    expect(screen.getByText(/Analyzing file.../i)).not.toBeNull();
  });

  test('Other CSV Form', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent);
      }

      if (event === IMPORT_SOURCE_FILE_ACK) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testPath' });
      }

      if (event === ANALYZE_SOURCE_FILE_ACK) {
        callback((event as unknown) as IpcRendererEvent, {
          status: 'success',
          sourceData: csvSourceData,
          metadata: csvMetadata,
        });
      }

      return ipcRenderer;
    });

    initImportWizard();
    const otherCSVOption = screen.getByLabelText('Other CSV');
    await act(async () => {
      userEvent.click(otherCSVOption);
    });
    expect(screen.getByText(/testpath/i)).not.toBeNull();

    const matchColumns = screen.getByText(/Match columns/i);
    const dateColumn = screen.getByLabelText(/Date column/i);
    const dateFormat = screen.getByLabelText(/Date format/i);
    const accountBalance = screen.getByLabelText(/Account balance/i);
    const descriptionColumn = screen.getByLabelText(/Description column/i);
    const amountColumn = screen.getByLabelText(/Amount column/i);
    const accountColumn = screen.getByLabelText('Account column / Optional');
    const categoryColumn = screen.getByLabelText('Category column / Optional');
    const importAccount = screen.getByLabelText(/Import to account/i);
    const accountName = screen.getByLabelText(/Account name/i);
    const accountType = screen.getByLabelText(/Account type/i);
    const accountInstitution = screen.getByLabelText('Account institution / Optional');
    const autoCalculate = screen.getByLabelText('Auto-calculate from transactions');

    expect(matchColumns).not.toBeNull();
    expect(dateColumn).not.toBeNull();
    expect(dateFormat).not.toBeNull();
    expect(descriptionColumn).not.toBeNull();
    expect(amountColumn).not.toBeNull();
    expect(accountColumn).not.toBeNull();
    expect(categoryColumn).not.toBeNull();
    expect(importAccount).not.toBeNull();
    expect(accountName).not.toBeNull();
    expect(accountType).not.toBeNull();
    expect(accountInstitution).not.toBeNull();
    expect(autoCalculate).not.toBeNull();
  });
});
