import React from 'react';
import styled from 'styled-components';

import Section from 'app/components/common/Section';
import AddAccountAssetForm from 'app/components/AccountAsset/AddAccountAssetForm';
import { container, body, subTitle } from './styles';

const Container = styled.div`${container}`;
const Body = styled.div`${body}`;
const SubTitle = styled.div`${subTitle}`;


const AddAccountAssetByHand = () => (
  <Section title="Add by hand" subTitle="Create a new account or asset">
    <Container>
      <Body>
        <SubTitle>Choose Type</SubTitle>
        <AddAccountAssetForm />
      </Body>
    </Container>
  </Section>
);

export default AddAccountAssetByHand;
