import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Lightning } from '@assets/icons/Lightning.svg';

import { container, icon } from './styles';

const Container = styled.div`
  ${container};
`;
const Icon = styled(Lightning)`
  ${icon};
`;

const LinkSideBarIcon = () => {
  return (
    <Container>
      <Icon />
    </Container>
  );
};

export default LinkSideBarIcon;
