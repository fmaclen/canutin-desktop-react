import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { AppContext } from '@app/context/appContext';
import canutinLinkApi, { ApiEndpoints } from '@app/data/canutinLink.api';
import { StatusEnum } from '@appConstants/misc';

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

interface InstitutionProps {
  id: string;
  name: string;
  linked_accounts: number;
  error_code: string;
  error_message: string;
  last_update: Date;
}

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
  grid-gap: 4px;
`;

const CanutinLink = () => {
  const [userAccount, setUserAccount] = useState<UserAccountProps | null>(null);
  const { isUserLoggedIn } = useContext(AppContext);
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
    if (window.confirm("Are you sure? \n This action can't be un-done.")) {
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
    // eslint-disable-next-line
  }, []);

  return (
    <ScrollView title="Canutin Link" headerNav={<HeaderButtons />}>
      {!isUserLoggedIn && <UserAuthForm endpoint={ApiEndpoints.USER_LOGIN} />}
      {isUserLoggedIn && userAccount && (
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
                        <Value hasErrors={institution.error_code ? true : false}>
                          <span>{institution.name}</span>
                          <ButtonRow>
                            <Button onClick={() => handleUnlink(institution.id)}>Unlink</Button>
                            {institution.error_code && (
                              <Button
                                status={StatusEnum.ERROR}
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
                      {institution.error_code && (
                        <FieldNotice
                          error={true}
                          title={institution.error_code}
                          description={<div>{institution.error_message}</div>}
                        />
                      )}
                      <InputTextField
                        label="Linked accounts"
                        name="linkedAccounts"
                        value={`${institution.linked_accounts}`}
                        disabled
                      />
                      <InputTextField
                        label="Last sync"
                        name="lastSync"
                        value={`${institution.last_update}`}
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
