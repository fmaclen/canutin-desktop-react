import React, { useState } from 'react';
import styled from 'styled-components';

import ScrollView from 'app/components/common/ScrollView';
import AddAccountAssetForm from 'app/components/AccountAsset/AddAccountAssetForm';
import { container, subTitle } from './styles';
import { ACCOUNT } from '../../constants/misc';

const Container = styled.div`${container}`;
const SubTitle = styled.div`${subTitle}`;


const AddAccountAssetByHand = () => {
  const [formSubtitle, setFormSubtitle] = useState('Choose Type');
  return (
    <ScrollView title="Add by hand" subTitle="Create a new account or asset">
      <Container>
        <SubTitle>{formSubtitle}</SubTitle>
        <AddAccountAssetForm
          onRadioButtonChange={value =>
            setFormSubtitle(value === ACCOUNT ? 'Account details' : 'Asset details')
          }
        />
      </Container>
    </ScrollView>
  );
}

export default AddAccountAssetByHand;
