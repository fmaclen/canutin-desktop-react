import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Icon } from '@assets/icons/CanutinIcon.svg';

import { container, icon, windowControls, minimize, maximize, close } from './styles';

const Container = styled.div`
  ${container}
`;
const CanutinIcon = styled(Icon)`
  ${icon}
`;
const WindowControls = styled.nav`
  ${windowControls}
`
const Minimize = styled.button`
  ${minimize}
`
const Maximize = styled.button`
  ${maximize}
`
const Close = styled.button`
  ${close}
`

const isMacOs = () => {
  switch (process.platform) {
    case "win32":
    case "linux":
      return false;
    default:
      return true;
  }
} 

const TitleBar = () => (
  <Container>
    <CanutinIcon />
    {!isMacOs() && (
      <WindowControls>
        <Minimize />
        <Maximize maximized={false} />
        <Close />
      </WindowControls>
    )}
  </Container>
);

export default TitleBar;
