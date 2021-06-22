import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Button from '@components/common/Button';
import { buttonRow } from './styles';

import { routesPaths } from '@routes';

const ButtonRow = styled.div`
  ${buttonRow}
`;

const HeaderButtons = () => {
  const history = useHistory();

  return (
    <ButtonRow>
      <Button label="Add new" onClick={() => history.push(routesPaths.addAccountOrAssetByHand)} />
      <Button
        label="Import wizard"
        onClick={() => history.push(routesPaths.addAccountOrAssetByWizard)}
      />
    </ButtonRow>
  );
};

export default HeaderButtons;
