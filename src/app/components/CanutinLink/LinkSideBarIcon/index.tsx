import React, { useContext } from 'react';
import styled from 'styled-components';

import { LinkContext } from '@app/context/linkContext';
import { StatusEnum } from '@app/constants/misc';

import { ReactComponent as Lightning } from '@assets/icons/Lightning.svg';
import { container, icon } from './styles';

const Container = styled.div`
  ${container};
`;
const Icon = styled(Lightning)`
  ${icon};
`;

const LinkSideBarIcon = () => {
  const { profile, isOnline, errors } = useContext(LinkContext);

  const linkErrors = errors?.user || errors?.institution;

  return (
    <Container
      status={
        !profile
          ? null
          : !isOnline
          ? StatusEnum.WARNING
          : linkErrors
          ? StatusEnum.NEGATIVE
          : StatusEnum.POSITIVE
      }
    >
      <Icon />
    </Container>
  );
};

export default LinkSideBarIcon;
