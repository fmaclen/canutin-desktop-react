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
  const { linkAccount, setLinkAccount } = useContext(AppContext);
  const history = useHistory();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await canutinLinkApi
      .post(ApiEndpoints.USER_LOGOUT, {})
      .then(res => {
        setLinkAccount(null);
      })
      .catch(e => {});
  };

  const handleSync = () => {
    setLinkAccount(linkAccount && { ...linkAccount, isSyncing: true });
  };

  if (linkAccount) {
    return (
      <ButtonRow>
        <Button
          onClick={() => handleSync()}
          status={StatusEnum.NEUTRAL}
          disabled={linkAccount.isSyncing}
        >
          Sync
        </Button>
        <Button
          onClick={() => history.push(routesPaths.linkInstitution)}
          disabled={!linkAccount.isOnline}
        >
          Link institution
        </Button>
        <Button onClick={() => handleLogout()}>Logout</Button>
      </ButtonRow>
    );
  } else if (pathname === '/link') {
    return (
      <Button onClick={() => history.push(routesPaths.linkCreateAccount)}>Join private beta</Button>
    );
  } else {
    return <Button onClick={() => history.push(routesPaths.link)}>Already have an account?</Button>;
  }
};

export default HeaderButtons;
