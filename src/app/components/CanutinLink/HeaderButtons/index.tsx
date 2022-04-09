import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';

import LinkIpc from '@app/data/link.ipc';
import { LinkContext } from '@app/context/linkContext';
import { StatusEnum } from '@appConstants/misc';
import { routesPaths } from '@routes';

import Button from '@components/common/Button';

import { buttonRow } from './styles';

const ButtonRow = styled.div`
  ${buttonRow}
`;

const HeaderButtons = () => {
  const { profile, isSyncing, setIsSyncing } = useContext(LinkContext);
  const { pathname } = useLocation();
  const history = useHistory();

  if (profile) {
    return (
      <ButtonRow>
        <Button onClick={() => setIsSyncing(true)} status={StatusEnum.NEUTRAL} disabled={isSyncing}>
          Sync
        </Button>
        <Button onClick={() => history.push(routesPaths.linkInstitution)}>Link institution</Button>
        <Button onClick={() => LinkIpc.logout()}>Logout</Button>
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
