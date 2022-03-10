import React, { useEffect, useContext, useState } from 'react';
import { ipcRenderer, safeStorage } from 'electron';
import { useForm } from 'react-hook-form';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import ScrollView from '@components/common/ScrollView';
import Breadcrumbs from '@components/common/Breadcrumbs';
import Section from '@components/common/Section';
import SectionRow from '@components/common/SectionRow';
import PrimaryCard from '@components/common/PrimaryCard';
import PrimaryCardRow from '@components/common/PrimaryCardRow';
import Form from '@components/common/Form/Form';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@components/common/Form/SubmitButton';
import Fieldset from '@components/common/Form/Fieldset';
import InputTextField from '@components/common/Form/InputTextField';

import { ReactComponent as Vault } from '@assets/icons/Vault.svg';
import { ReactComponent as Browse } from '@assets/icons/Browse.svg';
import { OPEN_CREATE_VAULT, OPEN_EXISTING_VAULT, UNLOCK_VAULT } from '@constants/events';
import { VaultType } from '@appTypes/vault.type';
import { routesPaths } from '@routes';
import { emptyStatusMessage, StatusBarContext } from '@app/context/statusBarContext';
import Field from '@app/components/common/Form/Field';
import ToggleInputField from '@app/components/common/Form/ToggleInputField';
import InlineCheckbox from '@app/components/common/Form/Checkbox';
import InputText from '@app/components/common/Form/InputText';

const Setup = () => {
  const [filePath, setFilePath] = useState('');
  const [hasSafeStorage, setHasSafeStorage] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const { setStatusMessage, setBreadcrumbs } = useContext(StatusBarContext);
  const noVaultBreadcrumbs = [{ breadcrumb: 'Canutin setup', path: '/' }];
  const breadcrumbItems = useBreadcrumbs(noVaultBreadcrumbs, {
    excludePaths: Object.values(routesPaths),
  });

  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      filePath: '',
      masterKey: '',
      rememberMasterkey: false,
    },
  });
  const masterKey = watch('masterKey');
  const submitDisabled = !masterKey;

  useEffect(() => {
    setBreadcrumbs(<Breadcrumbs items={breadcrumbItems} />);

    return () => {
      setStatusMessage(emptyStatusMessage);
      setBreadcrumbs(undefined);
    };
  }, []);

  const onOpenCreateVault = async () => {
    const { newFilePath, isEncryptionAvailable } = await ipcRenderer.invoke(OPEN_CREATE_VAULT);
    setFilePath(newFilePath);
    setHasSafeStorage(isEncryptionAvailable);
    setIsNew(true);
  };

  const onOpenExistingVault = async () => {
    const { existingFilePath, isEncryptionAvailable } = await ipcRenderer.invoke(
      OPEN_EXISTING_VAULT
    );
    setFilePath(existingFilePath);
    setHasSafeStorage(isEncryptionAvailable);
    setIsNew(false);
  };

  const onSubmit = async (unlockVaultSubmit: VaultType) => {
    await ipcRenderer.send(UNLOCK_VAULT, {
      ...unlockVaultSubmit,
      filePath: filePath,
      isNew: isNew,
    });
  };

  return (
    <ScrollView title={filePath ? 'Canutin security' : 'Canutin setup'} wizard={true}>
      <SectionRow>
        {!filePath && (
          <Section title="Choose vault">
            <PrimaryCardRow>
              <PrimaryCard
                icon={<Vault />}
                title="New vault"
                subTitle="Create a brand new vault"
                onClick={onOpenCreateVault}
              />
              <PrimaryCard
                icon={<Browse />}
                title="Existing vault"
                subTitle="Locate an existing vault file"
                onClick={onOpenExistingVault}
              />
            </PrimaryCardRow>
          </Section>
        )}

        {/* TODO: should also show this form when the app boots up and only the filepath is present */}
        {/* TODO: The wording on the UI needs improvement, i.e: when a new vault is created you shouldn't "unlock" the vault */}
        {filePath && (
          <Section title="Unlock vault">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Fieldset>
                <InputTextField
                  label="Chosen vault"
                  name="currentfilePath"
                  value={filePath}
                  disabled
                />
                <Field label="Master key" name="masterKeyCombo">
                  <ToggleInputField>
                    <InputText name="masterKey" type="password" required register={register} />
                    {hasSafeStorage && (
                      <InlineCheckbox
                        name="rememberMasterKey"
                        id="rememberMasterKey"
                        label="Remember key"
                        register={register}
                      />
                    )}
                  </ToggleInputField>
                </Field>
              </Fieldset>
              <FormFooter>
                <SubmitButton disabled={submitDisabled}>Unlock</SubmitButton>
              </FormFooter>
            </Form>
          </Section>
        )}
      </SectionRow>
    </ScrollView>
  );
};

export default Setup;
