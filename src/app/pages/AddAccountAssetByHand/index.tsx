import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import ScrollView from 'app/components/common/ScrollView';
import AddAccountAssetForm from 'app/components/AccountAsset/AddAccountAssetForm';
import StatusBar from 'app/components/common/StatusBar';
import { DB_NEW_ACCOUNT_ACK, DB_NEW_ASSET_ACK } from 'constants/events';
import { container, subTitle } from './styles';
import { ACCOUNT } from '../../constants/misc';
import { StatusBarContext } from '../../context';

const Container = styled.div`${container}`;
const SubTitle = styled.div`${subTitle}`;


const AddAccountAssetByHand = () => {
  const [formSubtitle, setFormSubtitle] = useState('Choose Type');
  const { successMessage, setSuccessMessage } = useContext(StatusBarContext);

  useEffect(() => {
    ipcRenderer.on(DB_NEW_ASSET_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage(`${name} asset was succesfully created`);
    });

    ipcRenderer.on(DB_NEW_ACCOUNT_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage(`${name} account was succesfully created`);
    });
  }, [setSuccessMessage]);

  const onCloseMessage = () => {
    setSuccessMessage('');
  }

  return (
    <>
      <ScrollView title="Add by hand" subTitle="Create a new account or asset">
        <Container>
          <SubTitle>{formSubtitle}</SubTitle>
          <AddAccountAssetForm
            onRadioButtonChange={value =>
              setFormSubtitle(value === ACCOUNT ? 'Account details' : 'Asset details')
            }
          />
        </Container>
      </ScrollView>
      <StatusBar successMessage={successMessage} onClickButton={onCloseMessage} />
    </>
  );
}

export default AddAccountAssetByHand;
