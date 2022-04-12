import React from 'react';
import styled from 'styled-components';
import { shell } from 'electron';

import { Link } from 'react-router-dom';

import { container } from './styles';

const ContainerExternal = styled.button`
  ${container}
`;

const ContainerInternal = styled(Link)`
  ${container}
`;

interface TextLinkProps {
  label: string;
  pathname: string;
  isExternal?: boolean;
  state?: any;
}

const TextLink = ({ pathname, isExternal, state, label }: TextLinkProps) => {
  if (isExternal) {
    return (
      <ContainerExternal type="button" onClick={() => shell.openExternal(pathname)}>
        {label}
      </ContainerExternal>
    );
  } else {
    return <ContainerInternal to={{ pathname, state }}>{label}</ContainerInternal>;
  }
};

export default TextLink;
