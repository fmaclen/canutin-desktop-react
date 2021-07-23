import React, { useContext } from 'react';
import styled from 'styled-components';

import { container, icon } from './styles';
import { AppContext } from '@app/context/appContext';
import { StatusEnum } from '@app/constants/misc';

import { ReactComponent as Lightning } from '@assets/icons/Lightning.svg';

const Container = styled.div`
  ${container};
`;
const Icon = styled(Lightning)`
  ${icon};
`;

const LinkSideBarIcon = () => {
  const { linkAccount } = useContext(AppContext);

  const linkAccountErrors = linkAccount?.errors?.user || linkAccount?.errors?.institution;

  return (
    <Container
      status={!linkAccount ? null : linkAccountErrors ? StatusEnum.NEGATIVE : StatusEnum.POSITIVE}
    >
      <Icon />
    </Container>
  );
};

export default LinkSideBarIcon;
