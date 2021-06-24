import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@components/common/Button';

import { routesPaths } from '@routes';

const BalanceSheetRedirectButtons = () => {
  const history = useHistory();

  return (
    <div>
      <Button label="Add new" onClick={() => history.push(routesPaths.addAccountOrAssetByHand)} />
      <Button
        label="Import wizard"
        onClick={() => history.push(routesPaths.addAccountOrAssetByWizard)}
      />
    </div>
  );
};

export default BalanceSheetRedirectButtons;
