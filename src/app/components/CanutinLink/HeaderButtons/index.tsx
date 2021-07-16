import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';

import { AppContext } from '@app/context/appContext';
import { routesPaths } from '@routes';

import Button from '@components/common/Button';
import { buttonRow } from './styles';

const ButtonRow = styled.div`
  ${buttonRow}
`;

const HeaderButtons = () => {
  const { isUserLoggedIn } = useContext(AppContext);
  const history = useHistory();
  const { pathname } = useLocation();

  if (isUserLoggedIn) {
    return (
      <ButtonRow>
        <Button onClick={() => console.log('TODO: Sync')}>Sync</Button>
        <Button onClick={() => console.log('TODO: Link institution')}>Link institution</Button>
        <Button onClick={() => console.log('TODO: Logout')}>Logout</Button>
      </ButtonRow>
    );
  } else if (pathname === '/link') {
    return (
      <Button onClick={() => history.push(routesPaths.linkCreateAccount)}>Create account</Button>
    );
  } else {
    return <Button onClick={() => history.push(routesPaths.link)}>Already have an account?</Button>;
  }
};

export default HeaderButtons;
