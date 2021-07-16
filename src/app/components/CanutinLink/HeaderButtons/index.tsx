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
  const location = useLocation();

  return (
    <ButtonRow>
      {isUserLoggedIn && (
        <>
          <Button onClick={() => console.log('TODO: Sync')}>Sync</Button>
          <Button onClick={() => console.log('TODO: Link institution')}>Link institution</Button>
          <Button onClick={() => console.log('TODO: Logout')}>Logout</Button>
        </>
      )}

      {!isUserLoggedIn && location.pathname === '/link' ? (
        <Button onClick={() => history.push(routesPaths.linkCreateAccount)}>Create account</Button>
      ) : (
        <Button onClick={() => history.push(routesPaths.link)}>Already have an account?</Button>
      )}
    </ButtonRow>
  );
};

export default HeaderButtons;
