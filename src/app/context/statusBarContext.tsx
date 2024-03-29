import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';

import { StatusEnum } from '@app/constants/misc';

export interface StatusMessageProps {
  message: string | ReactNode;
  isLoading: boolean;
  sentiment?: StatusEnum;
}

interface StatusBarContextValue {
  statusMessage: StatusMessageProps;
  breadcrumbs: string | ReactNode;
  setStatusMessage: Dispatch<SetStateAction<StatusMessageProps>>;
  setBreadcrumbs: (_: string[] | ReactNode) => void;
}

export const emptyStatusMessage = { message: '', isLoading: false };

export const StatusBarContext = createContext<StatusBarContextValue>({
  statusMessage: emptyStatusMessage,
  breadcrumbs: null,
  setStatusMessage: () => {},
  setBreadcrumbs: () => {},
});

export const StatusBarProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [statusMessage, setStatusMessage] = useState<StatusMessageProps>(emptyStatusMessage);
  const [breadcrumbs, setBreadcrumbs] = useState<string[] | ReactNode>();

  const value = {
    statusMessage,
    breadcrumbs,
    setStatusMessage,
    setBreadcrumbs,
  };

  return <StatusBarContext.Provider value={value}>{children}</StatusBarContext.Provider>;
};
