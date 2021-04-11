import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import RadioInputGroup from '@components/common/RadioInputGroup';
import ChooseFileInput from '@components/common/ChooseFileInput';

import { IMPORT_SOURCE_FILE, IMPORT_SOURCE_FILE_ACK } from '@constants/events';
import { sourceExtensionFile, enumImportTitleOptions, StatusEnum } from '@appConstants/misc';

import {
  formContainer,
  form,
  formFooter,
  formSubmitButton,
  balanceContainer,
  balanceSubContainer,
  customInputContainer,
  checkboxContainer,
  checkbox,
  checkboxLabel,
  customInputLabel,
  hrDivider,
} from './styles';
import sourceAlertsLookup from './dataSourceAlerts';

const FormContainer = styled.div`
  ${formContainer}
`;
const Form = styled.form`
  ${form}
`;
const FormFooter = styled.div`
  ${formFooter}
`;
const FormSubmitButton = styled.button`
  ${formSubmitButton}
`;
const BalanceContainer = styled.div`
  ${balanceContainer}
`;
const BalanceSubContainer = styled.div`
  ${balanceSubContainer}
`;
const CustomInputLabel = styled.label`
  ${customInputLabel}
`;
const CustomInputContainer = styled.div`
  ${customInputContainer}
`;
const CheckboxContainer = styled.div`
  ${checkboxContainer}
`;
const Checkbox = styled.input`
  ${checkbox}
`;
const CheckboxLabel = styled.label`
  ${checkboxLabel}
`;

const Hr = styled.hr`
  ${hrDivider}
`;

const filePathStatusMessage = (status: StatusEnum) => {
  switch (status) {
    case StatusEnum.LOADING:
      return 'Analyzing file...';
    case StatusEnum.ERROR:
      return "Couldn't interpret the chosen file";
    case StatusEnum.SUCCESS:
      return 'Successful analysis';
  }
};

const ImportWizardForm = () => {
  const [source, setSource] = useState<enumImportTitleOptions | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [filePathStatus, setFilePathStatus] = useState<StatusEnum>();
  console.log(filePath);

  useEffect(() => {
    ipcRenderer.on(IMPORT_SOURCE_FILE_ACK, (_: IpcRendererEvent, { filePath: sourceFilePath }) => {
      setFilePath(sourceFilePath);
      setFilePathStatus(StatusEnum.SUCCESS);
    });
  }, []);

  const onChooseFileInput = () => {
    source && ipcRenderer.send(IMPORT_SOURCE_FILE, sourceExtensionFile(source));
    setFilePathStatus(StatusEnum.LOADING);
  };

  return (
    <FormContainer>
      <RadioInputGroup
        label="Import from"
        name="importSource"
        values={Object.values(enumImportTitleOptions)}
        onSelectOption={value => {
          setSource(value as enumImportTitleOptions);
          setFilePath(null);
        }}
      />
      {sourceAlertsLookup(source)}
      {source && (
        <ChooseFileInput
          label="Choose source file"
          extensionType={sourceExtensionFile(source)}
          onSelect={onChooseFileInput}
          filePath={filePath}
          status={filePathStatus}
          statusMessage={filePathStatus && filePathStatusMessage(filePathStatus)}
        />
      )}
    </FormContainer>
  );
};

export default ImportWizardForm;
