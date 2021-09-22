import React, { useCallback, useEffect, useState, useContext } from 'react';
import { usePlaidLink, PlaidLinkOptions, PlaidLinkOnSuccess } from 'react-plaid-link';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { routesPaths } from '@routes';
import { StatusBarContext } from '@app/context/statusBarContext';
import canutinLinkApi, { ApiEndpoints, requestLinkSync } from '@app/data/canutinLink.api';

import { main } from '@components/common/ScrollView/styles';
import { plaidWizard } from './styles';
import { StatusEnum } from '@app/constants/misc';

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

let isNewInstitution = false;

const PlaidLink = ({ token }: PlaidLinkProps) => {
  const { setStatusMessage } = useContext(StatusBarContext);
  const { institution_id } = useParams<InstitutionParams>();
  const history = useHistory();

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (_public_token, metadata) => {
    if (institution_id) {
      // Updates existing item
      await canutinLinkApi
        .post(ApiEndpoints.UPDATE_INSTITUTION, metadata)
        .then(res => {
          setStatusMessage({
            sentiment: StatusEnum.POSITIVE,
            message: 'The institution is now fixed.',
            isLoading: false,
          });
          history.push(routesPaths.link);
        })
        .catch(e => {
          setStatusMessage({
            sentiment: StatusEnum.NEGATIVE,
            message: "Couldn't fix the institution, please try again later.",
            isLoading: false,
          });
        });
    } else {
      setStatusMessage({
        sentiment: StatusEnum.NEUTRAL,
        message: 'Please wait while we gather the institution data...',
        isLoading: true,
      });

      history.push(routesPaths.balance);

      // Creates new item
      await canutinLinkApi
        .post(ApiEndpoints.NEW_INSTITUTION, metadata)
        .then(response => {
          isNewInstitution = true;

          if (response.status === 201) {
            setStatusMessage({
              sentiment: StatusEnum.POSITIVE,
              message: 'The institution has been linked succesfully',
              isLoading: false,
            });
          } else if (response.status === 204) {
            setStatusMessage({
              sentiment: StatusEnum.WARNING,
              message:
                'The institution has been linked but transaction data is not available yet, please try again later',
              isLoading: false,
            });
          }

          // TODO: handle `response.data.accounts`
          // Blocked by https://github.com/Canutin/desktop/issues/191
        })
        .catch(e => {
          setStatusMessage({
            sentiment: StatusEnum.NEGATIVE,
            message: "Couldn't link the institution, please try again later.",
            isLoading: false,
          });
        });
    }

    // eslint-disable-next-line
  }, []);

  const onExit = () => {
    !isNewInstitution && history.push(routesPaths.link);
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
    // eslint-disable-next-line
  }, [ready]);

  return <></>;
};

const LinkInstitution = () => {
  const { institution_id } = useParams<InstitutionParams>();
  const [token, setToken] = useState<string | null>(null);

  const newLinkToken = async () => {
    await canutinLinkApi.get(ApiEndpoints.NEW_INSTITUTION_TOKEN).then(response => {
      setToken(response.data.linkToken);
    });
  };

  const updateLinkToken = async () => {
    await canutinLinkApi
      .post(ApiEndpoints.UPDATE_INSTITUTION_TOKEN, { id: institution_id })
      .then(response => {
        setToken(response.data.linkToken);
      });
  };

  useEffect(() => {
    if (institution_id) {
      updateLinkToken();
    } else {
      newLinkToken();
    }
    // eslint-disable-next-line
  }, []);

  return <PlaidWizard wizard={true}>{token && <PlaidLink token={token} />}</PlaidWizard>;
};

export default LinkInstitution;
