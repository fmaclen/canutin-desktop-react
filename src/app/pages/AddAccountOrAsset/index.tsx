import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Section from 'app/components/common/Section';
import SetupOptionBox from 'app/components/SetupOptionBox';
import { ReactComponent as Sheet } from 'app/assets/icons/Sheet.svg';
import { ReactComponent as Keyboard } from 'app/assets/icons/Keyboard.svg';
import { ReactComponent as Bot } from 'app/assets/icons/Bot.svg';
import { ReactComponent as Lightning } from 'app/assets/icons/Lightning.svg';
import { body, subTitle, boxContainer, subDivision } from './styles';
import { routesPaths } from '../../routes';

const Body = styled.div`${body}`;
const SubTitle = styled.div`${subTitle}`;
const BoxContainer = styled.div`${boxContainer}`;
const SubDivision = styled.div`${subDivision}`;

const AddAccountOrAsset = () => {
  const { push } = useHistory();

  return (
    <Section title="Add accounts or assets">
      <Body>
        <SubDivision>
          <SubTitle>Add New</SubTitle>
          <BoxContainer>
            <SetupOptionBox
              icon={<Sheet />}
              title="Import wizzard"
              subTitle="Import data from sites like Mint, Personal Capital, YNAB, etc..."
              onClick={() => {}}
              width={220}
            />
            <SetupOptionBox
              icon={<Keyboard />}
              title="By hand"
              subTitle="Create a new account by entering data manually."
              onClick={() => push(routesPaths.addAccountOrAssetByHand)}
              width={220}
            />
          </BoxContainer>
        </SubDivision>
        <SubDivision>
          <SubTitle>Coming Soon</SubTitle>
          <BoxContainer>
            <SetupOptionBox
              icon={<Bot />}
              title="Unleash a Bot"
              subTitle="Attemp to grab accounts and transactions from your financial institution’s website."
              onClick={() => {}}
              width={220}
              disabled
            />
            <SetupOptionBox
              icon={<Lightning />}
              title="Canutin Link"
              subTitle="Automatically import and sync accounts from your financial institution."
              onClick={() => {}}
              width={220}
              disabled
            />
          </BoxContainer>
        </SubDivision>
      </Body>
    </Section>
  );
}

export default AddAccountOrAsset;
