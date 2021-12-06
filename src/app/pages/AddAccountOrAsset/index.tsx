import React, { useContext, useEffect } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import SectionRow from '@components/common/SectionRow';
import PrimaryCard from '@components/common/PrimaryCard';
import PrimaryCardRow from '@components/common/PrimaryCardRow';

import { routesPaths } from '@routes';
import { AppContext } from '@app/context/appContext';
import { ReactComponent as Sheet } from '@assets/icons/Sheet.svg';
import { ReactComponent as Keyboard } from '@assets/icons/Keyboard.svg';
import { ReactComponent as Bot } from '@assets/icons/Bot.svg';
import { ReactComponent as Lightning } from '@assets/icons/Lightning.svg';
import { ReactComponent as PaperAccount } from '@assets/icons/PaperAccount.svg';
import { addAccountOrAssetSectionRow, lightningPrimaryCard } from './styles';

import { DB_SEED_VAULT, DB_SEED_VAULT_ACK } from '@constants/events';
import { EVENT_SUCCESS } from '@constants/eventStatus';
import { StatusBarContext } from '@app/context/statusBarContext';
import { StatusEnum } from '@app/constants/misc';

const AddAccountOrAssetSectionRow = styled(SectionRow)`
  ${addAccountOrAssetSectionRow};
`;
const LightningPrimaryCard = styled(Lightning)`
  ${lightningPrimaryCard};
`;

const AddAccountOrAsset = () => {
  const { push } = useHistory();
  const { isDbEmpty } = useContext(AppContext);
  const { setStatusMessage } = useContext(StatusBarContext);

  const seedVault = () => {
    setStatusMessage({
      sentiment: StatusEnum.NEUTRAL,
      message: 'Seeding vault with demo data...',
      isLoading: true,
    });
    ipcRenderer.send(DB_SEED_VAULT);
  };

  useEffect(() => {
    ipcRenderer.on(DB_SEED_VAULT_ACK, (_: IpcRendererEvent, { status }) => {
      if (status === EVENT_SUCCESS) {
        setStatusMessage({
          message: 'The vault was seeded succesfully',
          sentiment: StatusEnum.POSITIVE,
          isLoading: false,
        });
        push(routesPaths.balance);
      }
    });
  }, []);

  return (
    <ScrollView title="Add or update data" wizard={true}>
      <SectionRow>
        {isDbEmpty && (
          <Section title="Seed vault">
            <PrimaryCard
              icon={<PaperAccount />}
              title="Demo"
              subTitle="Explore Canutin with automatically generated example data"
              onClick={seedVault}
            />
          </Section>
        )}
        <Section title="Seamless">
          <PrimaryCardRow>
            <PrimaryCard
              icon={<LightningPrimaryCard />}
              title="Canutin Link"
              subTitle="Automatically import and sync accounts from your financial institution."
              onClick={() => push(routesPaths.link)}
            />
          </PrimaryCardRow>
        </Section>
        <Section title="Semi-automatic">
          <PrimaryCardRow>
            <PrimaryCard
              icon={<Sheet />}
              title="Import wizard"
              subTitle="Import data from sites like Mint, Personal Capital, YNAB, etc..."
              onClick={() => push(routesPaths.addAccountOrAssetByWizard)}
            />
            <PrimaryCard
              icon={<Bot />}
              title="Unleash a bot"
              subTitle="Attemp to grab accounts and transactions from your financial institution’s website — Coming soon"
              onClick={() => {}}
              disabled
            />
          </PrimaryCardRow>
        </Section>
        <Section title="Manual">
          <PrimaryCardRow>
            <PrimaryCard
              icon={<Keyboard />}
              title="By hand"
              subTitle="Create a new account by entering data manually."
              onClick={() => push(routesPaths.addAccountOrAssetByHand)}
            />
          </PrimaryCardRow>
        </Section>
      </SectionRow>
    </ScrollView>
  );
};

export default AddAccountOrAsset;
