import React, { useEffect, useState, useContext } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useLocation, useHistory } from 'react-router-dom';

import Section from '@components/common/Section';
import RemoveSection from '@components/common/Form/RemoveSection';

import { Asset } from '@database/entities';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { StatusBarContext } from '@app/context/statusBarContext';
import AssetIpc from '@app/data/asset.ipc';
import { StatusEnum } from '@app/constants/misc';
import { DB_GET_ACCOUNT_ACK, DB_DELETE_ACCOUNT_ACK } from '@constants/events';
import { rootRoutesPaths } from '@app/routes';

interface AssetOverviewEditProps {
  temporalAsset: Asset;
}

const AssetOverviewEdit = ({ temporalAsset }: AssetOverviewEditProps) => {
  // const [account, setAccount] = useState<Account>();
  // const { setStatusMessage } = useContext(StatusBarContext);
  // const history = useHistory();

  // useEffect(() => {
  //   AccountIpc.getAccountById(temporalAccount.id);

  //   ipcRenderer.on(DB_GET_ACCOUNT_ACK, (_: IpcRendererEvent, { account: newAccount }) => {
  //     setAccount(newAccount);
  //   });

  //   ipcRenderer.on(DB_DELETE_ACCOUNT_ACK, (_: IpcRendererEvent, { status, message }) => {
  //     if (status === EVENT_SUCCESS) {
  //       setStatusMessage({
  //         message: 'Account removed',
  //         sentiment: StatusEnum.POSITIVE,
  //         isLoading: false,
  //       });
  //       history.push(rootRoutesPaths.balance);
  //     }

  //     if (status === EVENT_ERROR) {
  //       setStatusMessage({ message: message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
  //     }
  //   });

  //   return () => {
  //     ipcRenderer.removeAllListeners(DB_GET_ACCOUNT_ACK);
  //     ipcRenderer.removeAllListeners(DB_DELETE_ACCOUNT_ACK);
  //   };
  // }, []);

  const onRemove = () => {};

  return (
    <>
      <Section title="Account balance"></Section>
      <Section title="Account details"></Section>
      <RemoveSection
        confirmationMessage="Are you sure you want to remove this account?"
        onRemove={onRemove}
        removeMessage={
          <>
            Remove account <b></b>
          </>
        }
      />
    </>
  );
};

export default AssetOverviewEdit;
