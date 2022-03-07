import React, { useEffect, useContext, useState } from 'react';
import { ipcRenderer } from 'electron';
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

const Setup = () => {
  const [filePath, setFilePath] = useState('');
  const [isNew, setIsNew] = useState(false);
  const { setStatusMessage, setBreadcrumbs } = useContext(StatusBarContext);
  const noVaultBreadcrumbs = [{ breadcrumb: 'Canutin setup', path: '/' }];
  const breadcrumbItems = useBreadcrumbs(noVaultBreadcrumbs, {
    excludePaths: Object.values(routesPaths),
  });

  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      filePath: filePath,
      masterKey: '',
      isNew: isNew,
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
    const newfilePath = await ipcRenderer.invoke(OPEN_CREATE_VAULT);
    setFilePath(newfilePath);
    setIsNew(true);
  };

  const onOpenExistingVault = async () => {
    const existingfilePath = await ipcRenderer.invoke(OPEN_EXISTING_VAULT);
    setFilePath(existingfilePath);
    setIsNew(false);
  };

  const onSubmit = async (unlockVaultSubmit: VaultType) => {
    const toto = { ...unlockVaultSubmit, isNew: isNew };
    await ipcRenderer.send(UNLOCK_VAULT, { ...unlockVaultSubmit, isNew: isNew });
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
                <InputTextField
                  label="Master key"
                  name="masterKey"
                  type="password"
                  required
                  register={register}
                />
                <input type="hidden" name="filePath" value={filePath} ref={register} />
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
