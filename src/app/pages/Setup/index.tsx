import React, { useEffect, useContext } from 'react';
import { ipcRenderer } from 'electron';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import ScrollView from '@components/common/ScrollView';
import Breadcrumbs from '@components/common/Breadcrumbs';
import Section from '@components/common/Section';
import SectionRow from '@components/common/SectionRow';
import PrimaryCard from '@components/common/PrimaryCard';
import PrimaryCardRow from '@components/common/PrimaryCardRow';

import { ReactComponent as Vault } from '@assets/icons/Vault.svg';
import { ReactComponent as Browse } from '@assets/icons/Browse.svg';
import { VAULT_OPEN_SAVE_DIALOG, VAULT_OPEN_EXISTING_FILE_DIALOG } from '@constants/vault';
import { routesPaths } from '@routes';
import { AppContext } from '@app/context/appContext';
import { emptyStatusMessage, StatusBarContext } from '@app/context/statusBarContext';
import { VaultStatusEnum } from '@enums/vault.enum';

const Setup = () => {
  const { setVaultPath, setVaultStatus } = useContext(AppContext);
  const { setStatusMessage, setBreadcrumbs } = useContext(StatusBarContext);
  const noVaultBreadcrumbs = [{ breadcrumb: 'Canutin setup', path: '/setup' }];
  const breadcrumbItems = useBreadcrumbs(noVaultBreadcrumbs, {
    excludePaths: Object.values(routesPaths),
  });

  useEffect(() => {
    setBreadcrumbs(<Breadcrumbs items={breadcrumbItems} />);

    return () => {
      setStatusMessage(emptyStatusMessage);
      setBreadcrumbs(undefined);
    };
  }, []);

  const onOpenCreateVault = async () => {
    const newFilePath = await ipcRenderer.invoke(VAULT_OPEN_SAVE_DIALOG);
    setVaultPath('');
    setVaultPath(newFilePath);
    setVaultStatus(VaultStatusEnum.SET_NEW_NOT_READY);
  };

  const onOpenExistingVault = async () => {
    const existingFilePath = await ipcRenderer.invoke(VAULT_OPEN_EXISTING_FILE_DIALOG);
    setVaultPath('');
    setVaultPath(existingFilePath);
    setVaultStatus(VaultStatusEnum.SET_EXISTING_NOT_READY);
  };

  return (
    <ScrollView title={'Canutin setup'} wizard={true}>
      <SectionRow>
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
      </SectionRow>
    </ScrollView>
  );
};

export default Setup;
