import React, { useCallback, useEffect, useState, useContext } from 'react';
import { usePlaidLink, PlaidLinkOptions, PlaidLinkOnSuccess } from 'react-plaid-link';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { routesPaths } from '@routes';
import { StatusBarContext } from '@app/context/statusBarContext';
import canutinLinkApi, { ApiEndpoints } from '@app/data/canutinLink.api';

import { main } from '@components/common/ScrollView/styles';

interface PlaidLinkProps {
  token: string;
}

type InstitutionParams = {
  institution_id: string;
};

const PlaidWizard = styled.main`
  ${main}
`;

const PlaidLink = ({ token }: PlaidLinkProps) => {
  const { successMessage, setSuccessMessage, setErrorMessage } = useContext(StatusBarContext);
  const { institution_id } = useParams<InstitutionParams>();
  const history = useHistory();

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (_public_token, metadata) => {
    if (institution_id) {
      // Updates existing item
      await canutinLinkApi
        .post(ApiEndpoints.UPDATE_INSTITUTION, metadata)
        .then(res => {
          setSuccessMessage('The institution is now fixed');
          history.push(routesPaths.link);
        })
        .catch(e => {
          setErrorMessage("Couldn't fix the institution, please try again later.");
        });
    } else {
      // Creates new item
      await canutinLinkApi
        .post(ApiEndpoints.NEW_INSTITUTION, metadata)
        .then(res => {
          setSuccessMessage('The institution is now linked');
          history.push(routesPaths.balance);
        })
        .catch(e => {
          setErrorMessage("Couldn't link the institution, please try again later.");
        });
    }
    // eslint-disable-next-line
  }, []);

  const onExit = () => {
    !successMessage && history.push(routesPaths.link);
  };

  const config: PlaidLinkOptions = { token, onSuccess, onExit };
  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    open();
    // eslint-disable-next-line
  }, [ready]);

  return <></>;
};

const LinkInstitution = () => {
  const { institution_id } = useParams<InstitutionParams>();
  const [token, setToken] = useState<string | null>(null);

  const newLinkToken = async () => {
    await canutinLinkApi.get(ApiEndpoints.NEW_INSTITUTION_TOKEN).then(response => {
      setToken(response.data.link_token);
    });
  };

  const updateLinkToken = async () => {
    await canutinLinkApi
      .post(ApiEndpoints.UPDATE_INSTITUTION_TOKEN, { id: institution_id })
      .then(response => {
        setToken(response.data.link_token);
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
