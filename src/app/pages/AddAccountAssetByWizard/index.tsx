import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import ScrollView from '@components/common/ScrollView';
import ImportWizardForm from '@components/AccountAsset/ImportWizardForm';
import StatusBar from '@components/common/StatusBar';

import { DB_NEW_ACCOUNT_ACK, DB_NEW_ASSET_ACK } from '@constants/events'
import { StatusBarContext } from '@app/context';

import { container, subTitle } from './styles';

const Container = styled.div`
  ${container}
`;
const SubTitle = styled.div`
  ${subTitle}
`;

const SUCCESS_MESSAGE_TIMEOUT = 5000;

const AddAccountAssetByWizard = () => {
  const { successMessage, setSuccessMessage } = useContext(StatusBarContext);

  useEffect(() => {
    ipcRenderer.on(DB_NEW_ASSET_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage(`${name} asset was successfully created`);
      setTimeout(() => {
        setSuccessMessage('');
      }, SUCCESS_MESSAGE_TIMEOUT);
    });

    ipcRenderer.on(DB_NEW_ACCOUNT_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage(`${name} account was successfully created`);
      setTimeout(() => {
        setSuccessMessage('');
      }, SUCCESS_MESSAGE_TIMEOUT);
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_NEW_ASSET_ACK);
      ipcRenderer.removeAllListeners(DB_NEW_ACCOUNT_ACK);
    };
  }, [setSuccessMessage]);

  const onCloseMessage = () => {
    setSuccessMessage('');
  };

  return (
    <>
      <ScrollView title="Import wizard" subTitle="Add or update accounts, assets, balances and transactions">
        <Container>
          <SubTitle>Data Source</SubTitle>
          <ImportWizardForm />
        </Container>
      </ScrollView>
      <StatusBar successMessage={successMessage} onClickButton={onCloseMessage} />
    </>
  );
};

export default AddAccountAssetByWizard;
