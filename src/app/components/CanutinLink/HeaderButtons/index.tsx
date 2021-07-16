import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';

import { StatusEnum } from '@appConstants/misc';
import { AppContext } from '@app/context/appContext';
import { routesPaths } from '@routes';
import canutinLinkApi, { ApiEndpoints } from '@app/data/canutinLink.api';

import Button from '@components/common/Button';
import { buttonRow } from './styles';

const ButtonRow = styled.div`
  ${buttonRow}
`;

const HeaderButtons = () => {
  const { isUserLoggedIn, setIsUserLoggedIn } = useContext(AppContext);
  const history = useHistory();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await canutinLinkApi
      .post(ApiEndpoints.USER_LOGOUT, {})
      .then(res => {
        setIsUserLoggedIn(false);
      })
      .catch(e => {});
  };

  if (isUserLoggedIn) {
    return (
      <ButtonRow>
        <Button onClick={() => console.log('TODO: Sync')} status={StatusEnum.LOADING}>
          Sync
        </Button>
        <Button onClick={() => history.push(routesPaths.linkInstitution)}>Link institution</Button>
        <Button onClick={() => handleLogout()}>Logout</Button>
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
