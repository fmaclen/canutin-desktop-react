import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import GlobalStyle from '@app/styles/global';

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return <GlobalStyle>{children}</GlobalStyle>;
};

const renderWrapper = (
  ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
  { ...options }: any
) => {
  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

export default renderWrapper;
