import React, { useCallback, useEffect, useState, useContext } from 'react';
import { ipcRenderer } from 'electron';
import { usePlaidLink, PlaidLinkOptions, PlaidLinkOnSuccess } from 'react-plaid-link';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { LINK_NEW_INSTITUTION_TOKEN_ACK, LINK_UPDATE_INSTITUTION_TOKEN_ACK } from '@constants/link';

import LinkIpc from '@app/data/link.ipc';
import { routesPaths } from '@routes';
import { StatusBarContext } from '@app/context/statusBarContext';
import { StatusEnum } from '@app/constants/misc';

import { plaidWizard } from './styles';
import { main } from '@components/common/ScrollView/styles';

interface PlaidLinkProps {
  token: string;
}

type InstitutionParams = {
  institution_id: string;
};

const PlaidWizard = styled.main`
  ${main}
  ${plaidWizard};
`;

const PlaidLink = ({ token }: PlaidLinkProps) => {
  const { setStatusMessage } = useContext(StatusBarContext);
  const { institution_id } = useParams<InstitutionParams>();
  const [isInstitutionNew, setIsInstitutionNew] = useState(false);
  const history = useHistory();

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (_public_token, metadata) => {
    if (institution_id) {
      LinkIpc.updateInstitution(metadata);
      history.push(routesPaths.link);
    } else {
      LinkIpc.createInstitution(metadata);
      setIsInstitutionNew(true);
      setStatusMessage({
        sentiment: StatusEnum.NEUTRAL,
        message: 'Gathering data from the institution',
        isLoading: true,
      });
      history.push(routesPaths.balance);
    }
  }, []);

  const onExit = () => {
    !isInstitutionNew && history.push(routesPaths.link);
  };

  const config: PlaidLinkOptions = { token, onSuccess, onExit };
  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    open();

    // Re-position Plaid's Iframe so it's a child of <ScrollView />
    const linkIframe = document.querySelector<HTMLElement>('iframe[id^=plaid-link-iframe]');
    const mainFrame = document.querySelector<HTMLElement>('#root > div > main');

    if (linkIframe) {
      linkIframe.style.position = 'relative';
      mainFrame?.appendChild(linkIframe);
    }
  }, [ready]);

  return <></>;
};

const LinkInstitution = () => {
  const { institution_id } = useParams<InstitutionParams>();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (institution_id) {
      LinkIpc.updateInstitutionToken(institution_id);
    } else {
      LinkIpc.newInstitutionToken();
    }

    ipcRenderer.on(LINK_NEW_INSTITUTION_TOKEN_ACK, (_, newInstitutionToken: string | null) => {
      setToken(newInstitutionToken);
    });

    ipcRenderer.on(
      LINK_UPDATE_INSTITUTION_TOKEN_ACK,
      (_, updateInstitutionToken: string | null) => {
        setToken(updateInstitutionToken);
      }
    );

    return () => {
      ipcRenderer.removeAllListeners(LINK_NEW_INSTITUTION_TOKEN_ACK);
      ipcRenderer.removeAllListeners(LINK_UPDATE_INSTITUTION_TOKEN_ACK);
    };
  }, []);

  return <PlaidWizard wizard={true}>{token && <PlaidLink token={token} />}</PlaidWizard>;
};

export default LinkInstitution;
