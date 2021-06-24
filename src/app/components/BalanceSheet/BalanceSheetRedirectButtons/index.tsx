import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@components/common/Button';

import { routesPaths } from '@routes';

const BalanceSheetRedirectButtons = () => {
  const history = useHistory();

  return (
    <div>
      <Button onClick={() => history.push(routesPaths.addAccountOrAssetByHand)}>Add new</Button>
      <Button onClick={() => history.push(routesPaths.addAccountOrAssetByWizard)}>
        Import wizard
      </Button>
    </div>
  );
};

export default BalanceSheetRedirectButtons;
