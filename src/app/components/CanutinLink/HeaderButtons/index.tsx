import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';

import { LinkContext } from '@app/context/linkContext';
import { StatusEnum } from '@appConstants/misc';
import { routesPaths } from '@routes';

import Button from '@components/common/Button';
import { buttonRow } from './styles';
import LinkIpc from '@app/data/link.ipc';

const ButtonRow = styled.div`
  ${buttonRow}
`;

const HeaderButtons = () => {
  const { profile, isSyncing, setIsSyncing } = useContext(LinkContext);
  const history = useHistory();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    LinkIpc.logout();
  };

  const handleSync = () => {
    setIsSyncing(true);
  };

  if (profile) {
    return (
      <ButtonRow>
        <Button onClick={() => handleSync()} status={StatusEnum.NEUTRAL} disabled={isSyncing}>
          Sync
        </Button>
        <Button onClick={() => history.push(routesPaths.linkInstitution)}>Link institution</Button>
        <Button onClick={() => handleLogout()}>Logout</Button>
      </ButtonRow>
    );
  } else if (pathname === '/link') {
    return (
      <Button
        status={StatusEnum.NEUTRAL}
        onClick={() => history.push(routesPaths.linkCreateAccount)}
      >
        Join private beta
      </Button>
    );
  } else {
    return <Button onClick={() => history.push(routesPaths.link)}>Already have an account?</Button>;
  }
};

export default HeaderButtons;
