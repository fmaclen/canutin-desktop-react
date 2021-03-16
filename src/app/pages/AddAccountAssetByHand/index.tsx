import React from 'react';
import styled from 'styled-components';

import ScrollView from 'app/components/common/ScrollView';
import AddAccountAssetForm from 'app/components/AccountAsset/AddAccountAssetForm';
import { container, body, subTitle } from './styles';

const Container = styled.div`${container}`;
const Body = styled.div`${body}`;
const SubTitle = styled.div`${subTitle}`;


const AddAccountAssetByHand = () => (
  <ScrollView title="Add by hand" subTitle="Create a new account or asset">
    <Container>
      <Body>
        <SubTitle>Choose Type</SubTitle>
        <AddAccountAssetForm />
      </Body>
    </Container>
  </ScrollView>
);

export default AddAccountAssetByHand;
