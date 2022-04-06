import { ProfileProps } from '@constants/link';
import { createContext, PropsWithChildren, useState } from 'react';

interface InstitutionProps {
  id: string;
  name: string;
  errorTitle: string;
  errorMessage: string;
  lastUpdate: Date;
}

interface LinkAccountErrorProps {
  user: boolean;
  institution: boolean;
}

interface LinkContextValue {
  isOnline: boolean;
  setIsOnline: (_: boolean) => void;
  isSyncing: boolean;
  setIsSyncing: (_: boolean) => void;
  lastSync: Date | null;
  setLastSync: (_: Date) => void;
  profile: ProfileProps | null;
  setProfile: (_: ProfileProps | null) => void;
  institutions: InstitutionProps[] | null;
  setInstitutions: (_: InstitutionProps[] | null) => void;
  errors: LinkAccountErrorProps | null;
  setErrors: (_: LinkAccountErrorProps | null) => void;
}

export const LinkContext = createContext<LinkContextValue>({
  isOnline: false,
  setIsOnline: () => {},
  isSyncing: false,
  setIsSyncing: () => {},
  lastSync: null,
  setLastSync: () => {},
  profile: null,
  setProfile: () => {},
  institutions: null,
  setInstitutions: () => {},
  errors: null,
  setErrors: () => {},
});

export const LinkProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [profile, setProfile] = useState<ProfileProps | null>(null);
  const [institutions, setInstitutions] = useState<InstitutionProps[] | null>(null);
  const [errors, setErrors] = useState<LinkAccountErrorProps | null>(null);

  const value = {
    isOnline,
    setIsOnline,
    isSyncing,
    setIsSyncing,
    lastSync,
    setLastSync,
    profile,
    setProfile,
    institutions,
    setInstitutions,
    errors,
    setErrors,
  };

  return <LinkContext.Provider value={value}>{children}</LinkContext.Provider>;
};
