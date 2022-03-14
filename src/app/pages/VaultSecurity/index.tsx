import React, { useEffect, useContext, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useForm } from 'react-hook-form';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import { VAULT_UNLOCK } from '@constants/vault';
import { APP_HAS_SAFE_STORAGE } from '@constants/app';
import { VaultType } from '@appTypes/vault.type';
import { routesPaths } from '@routes';
import { AppContext } from '@app/context/appContext';
import { emptyStatusMessage, StatusBarContext } from '@app/context/statusBarContext';

import ScrollView from '@components/common/ScrollView';
import Breadcrumbs from '@components/common/Breadcrumbs';
import Section from '@components/common/Section';
import SectionRow from '@components/common/SectionRow';
import Form from '@components/common/Form/Form';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@components/common/Form/SubmitButton';
import Fieldset from '@components/common/Form/Fieldset';
import InputTextField from '@components/common/Form/InputTextField';
import Field from '@app/components/common/Form/Field';
import ToggleInputField from '@app/components/common/Form/ToggleInputField';
import InlineCheckbox from '@app/components/common/Form/Checkbox';
import InputText from '@app/components/common/Form/InputText';

const VaultSecurity = () => {
  const { vaultPath } = useContext(AppContext);
  const [hasSafeStorage, setHasSafeStorage] = useState(false);
  const { setStatusMessage, setBreadcrumbs } = useContext(StatusBarContext);
  const vaultSecurityBreadcrumbs = [
    { breadcrumb: 'Canutin setup', path: '/setup' },
    { breadcrumb: 'Vault security', path: '/setup/security' },
  ];
  const breadcrumbItems = useBreadcrumbs(vaultSecurityBreadcrumbs, {
    excludePaths: Object.values(routesPaths),
  });

  useEffect(() => {
    // Using mounted state to handle the async function when component is unmounted
    // REF: https://www.benmvp.com/blog/handling-async-react-component-effects-after-unmount/
    let mounted = true;
    ipcRenderer.invoke(APP_HAS_SAFE_STORAGE).then(newItems => {
      if (mounted) {
        setHasSafeStorage(newItems);
      }
    });

    setBreadcrumbs(<Breadcrumbs items={breadcrumbItems} />);

    return () => {
      mounted = false;
      setStatusMessage(emptyStatusMessage);
      setBreadcrumbs(undefined);
    };
  }, []);

  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      vaultPath: '',
      vaultMasterKey: '',
      rememberVaultMasterkey: false,
    },
  });
  const vaultMasterKey = watch('vaultMasterKey');
  const submitDisabled = !vaultMasterKey;

  const onSubmit = async (unlockVaultSubmit: VaultType) => {
    await ipcRenderer.send(VAULT_UNLOCK, {
      ...unlockVaultSubmit,
      vaultPath: vaultPath,
    });
  };

  return (
    <ScrollView title={'Vault security'} wizard={true}>
      <SectionRow>
        <Section title="Vault encryption">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Fieldset>
              <InputTextField
                label="Current vault"
                name="currentVaultPath"
                value={vaultPath!}
                disabled
              />
              <Field label="Master key" name="masterKeyCombo">
                <ToggleInputField>
                  <InputText name="vaultMasterKey" type="password" required register={register} />
                  {hasSafeStorage && (
                    <InlineCheckbox
                      name="rememberVaultMasterKey"
                      id="rememberVaultMasterKey"
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
      </SectionRow>
    </ScrollView>
  );
};

export default VaultSecurity;
