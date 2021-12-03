import React, { useContext } from 'react';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router-dom';

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
import { DB_SEED_VAULT } from '@constants/events';

const seedVault = () => {
  ipcRenderer.send(DB_SEED_VAULT);
};

const AddAccountOrAsset = () => {
  const { push } = useHistory();
  const { isDbEmpty } = useContext(AppContext);

  return (
    <ScrollView title="Add accounts or assets" wizard={true}>
      <SectionRow>
        <Section title="Add new">
          <PrimaryCardRow>
            <PrimaryCard
              icon={<Sheet />}
              title="Import wizard"
              subTitle="Import data from sites like Mint, Personal Capital, YNAB, etc..."
              onClick={() => push(routesPaths.addAccountOrAssetByWizard)}
            />
            <PrimaryCard
              icon={<Keyboard />}
              title="By hand"
              subTitle="Create a new account by entering data manually."
              onClick={() => push(routesPaths.addAccountOrAssetByHand)}
            />
          </PrimaryCardRow>
        </Section>
        {isDbEmpty && (
          <Section title="Demo">
            <PrimaryCard
              icon={<Keyboard />}
              title="Seed "
              subTitle="Explore Canutin with automatically generated demo data"
              onClick={seedVault}
            />
          </Section>
        )}
        <Section title="Coming soon">
          <PrimaryCardRow>
            <PrimaryCard
              icon={<Bot />}
              title="Unleash a bot"
              subTitle="Attemp to grab accounts and transactions from your financial institution’s website."
              onClick={() => {}}
              disabled
            />
            <PrimaryCard
              icon={<Lightning />}
              title="Canutin Link"
              subTitle="Automatically import and sync accounts from your financial institution."
              onClick={() => {}}
              disabled
            />
          </PrimaryCardRow>
        </Section>
      </SectionRow>
    </ScrollView>
  );
};

export default AddAccountOrAsset;
