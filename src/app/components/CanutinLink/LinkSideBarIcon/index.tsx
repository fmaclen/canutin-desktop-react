import React, { useContext } from 'react';
import styled from 'styled-components';

import { ReactComponent as Lightning } from '@assets/icons/Lightning.svg';

import { container, icon } from './styles';
import { AppContext } from '@app/context/appContext';

const Container = styled.div`
  ${container};
`;
const Icon = styled(Lightning)`
  ${icon};
`;

const LinkSideBarIcon = () => {
  const { isUserLoggedIn } = useContext(AppContext);

  return (
    <Container active={isUserLoggedIn}>
      <Icon />
    </Container>
  );
};

export default LinkSideBarIcon;
