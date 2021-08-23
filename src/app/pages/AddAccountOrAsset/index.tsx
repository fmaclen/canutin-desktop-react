import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import SectionRow from '@components/common/SectionRow';
import PrimaryCard from '@components/common/PrimaryCard';
import PrimaryCardRow from '@components/common/PrimaryCardRow';

import { routesPaths } from '@routes';
import { ReactComponent as Sheet } from '@assets/icons/Sheet.svg';
import { ReactComponent as Keyboard } from '@assets/icons/Keyboard.svg';
import { ReactComponent as Bot } from '@assets/icons/Bot.svg';
import { ReactComponent as Lightning } from '@assets/icons/Lightning.svg';
import { addAccountOrAssetSectionRow, lightningPrimaryCard } from './styles';

const AddAccountOrAssetSectionRow = styled(SectionRow)`
  ${addAccountOrAssetSectionRow};
`;
const LightningPrimaryCard = styled(Lightning)`
  ${lightningPrimaryCard};
`;

const AddAccountOrAsset = () => {
  const { push } = useHistory();

  return (
    <ScrollView title="Add or update data" wizard={true}>
      <AddAccountOrAssetSectionRow>
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
      </AddAccountOrAssetSectionRow>
    </ScrollView>
  );
};

export default AddAccountOrAsset;
