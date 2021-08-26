import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import * as timeago from 'timeago.js';

import { AppContext } from '@app/context/appContext';
import { serverErrorStatusMessage } from '@app/context/statusBarContext';
import canutinLinkApi, { ApiEndpoints, InstitutionProps } from '@app/data/canutinLink.api';
import { StatusEnum } from '@appConstants/misc';
import { capitalize } from '@app/utils/strings.utils';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import HeaderButtons from '@app/components/CanutinLink/HeaderButtons';
import UserAuthForm from '@app/components/CanutinLink/UserAuthForm';
import EmptyCard from '@app/components/common/EmptyCard';
import Button from '@app/components/common/Button';
import Fieldset from '@components/common/Form/Fieldset';
import FieldNotice from '@components/common/Form/FieldNotice';
import InputTextField from '@components/common/Form/InputTextField';

import { container as institutions } from '@components/common/Form/Form/styles';
import { container as institution } from '@components/common/Form/FieldContainer/styles';
import { label } from '@components/common/Form/Field/styles';
import { row, value } from './styles';
import { routesPaths } from '@app/routes';
import SectionRow from '@app/components/common/SectionRow';

interface UserAccountProps {
  email: string;
  institutions: InstitutionProps[];
}

const Institutions = styled.div`
  ${institutions};
`;
const Institution = styled.div`
  ${institution};
`;
const Label = styled.p`
  ${label};
`;
const Value = styled.div`
  ${value};
`;
const ButtonRow = styled.div`
  ${row};
`;

const CanutinLink = () => {
  const [userAccount, setUserAccount] = useState<UserAccountProps | null>(null);
  const { linkAccount } = useContext(AppContext);
  const history = useHistory();

  const getUserDetails = async () => {
    await canutinLinkApi
      .get(ApiEndpoints.SUMMARY, {})
      .then(response => {
        setUserAccount(response.data);
      })
      .catch(e => {});
  };

  const handleUnlink = async (id: string) => {
    if (window.confirm('Are you sure you want to unlink this institution?')) {
      await canutinLinkApi
        .post(ApiEndpoints.UNLINK_INSTITUTION, { id: id })
        .then(res => {
          getUserDetails();
        })
        .catch(e => {});
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [linkAccount]);

  useEffect(() => {
    linkAccount && getUserDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <ScrollView title="Canutin Link" headerNav={<HeaderButtons />} wizard={!linkAccount}>
      {linkAccount && !linkAccount.isOnline && (
        <Section title="Connection error">
          <EmptyCard message={serverErrorStatusMessage.message} />
        </Section>
      )}
      {!linkAccount && (
        <SectionRow>
          <UserAuthForm endpoint={ApiEndpoints.USER_LOGIN} />
        </SectionRow>
      )}
      {linkAccount && userAccount && (
        <>
          <Section title="Summary">
            <EmptyCard message={`Logged in as: ${userAccount.email}`} />
          </Section>
          <Section title={`Linked institutions / ${userAccount?.institutions.length}`}>
            {userAccount && userAccount.institutions.length > 0 ? (
              <Institutions>
                {userAccount?.institutions.map((institution: InstitutionProps) => {
                  return (
                    <Fieldset key={institution.id}>
                      <Institution>
                        <Label>Institution</Label>
                        <Value hasErrors={institution.errorTitle ? true : false}>
                          <span>{institution.name}</span>
                          <ButtonRow>
                            <Button onClick={() => handleUnlink(institution.id)}>Unlink</Button>
                            {institution.errorTitle && (
                              <Button
                                status={StatusEnum.NEGATIVE}
                                onClick={() =>
                                  history.push(`${routesPaths.linkInstitution}/${institution.id}`)
                                }
                              >
                                Fix
                              </Button>
                            )}
                          </ButtonRow>
                        </Value>
                      </Institution>
                      {institution.errorTitle && (
                        <FieldNotice
                          error={true}
                          title={institution.errorTitle}
                          description={<div>{institution.errorMessage}</div>}
                        />
                      )}
                      <InputTextField
                        label="Last sync"
                        name="lastSync"
                        value={capitalize(timeago.format(institution.lastUpdate))}
                        disabled
                      />
                    </Fieldset>
                  );
                })}
              </Institutions>
            ) : (
              <EmptyCard message="No linked institutions." />
            )}
          </Section>
        </>
      )}
    </ScrollView>
  );
};

export default CanutinLink;
