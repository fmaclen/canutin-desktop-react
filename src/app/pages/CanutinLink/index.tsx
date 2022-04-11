import React, { useContext, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import LinkIpc from '@app/data/link.ipc';
import { routesPaths } from '@app/routes';
import { LinkContext } from '@app/context/linkContext';
import {
  serverErrorStatusMessage,
  StatusBarContext,
  StatusMessageProps,
} from '@app/context/statusBarContext';
import { ApiEndpoints, LINK_UNLINK_INSTITUTION_ACK } from '@constants/link';
import { InstitutionProps } from '@appTypes/canutinLink.type';
import { StatusEnum } from '@appConstants/misc';
import { capitalize } from '@app/utils/strings.utils';
import { formatRelativeDate, handleDate } from '@app/utils/date.utils';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import HeaderButtons from '@app/components/CanutinLink/HeaderButtons';
import UserAuthForm from '@app/components/CanutinLink/UserAuthForm';
import EmptyCard from '@app/components/common/EmptyCard';
import Button from '@app/components/common/Button';
import Fieldset from '@components/common/Form/Fieldset';
import FieldNotice from '@components/common/Form/FieldNotice';
import InputTextField from '@components/common/Form/InputTextField';
import SectionRow from '@app/components/common/SectionRow';

import { container as institutions } from '@components/common/Form/Form/styles';
import { container as institution } from '@components/common/Form/FieldContainer/styles';
import { label } from '@components/common/Form/Field/styles';
import { row, value } from './styles';

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
  const { isOnline, profile, institutions } = useContext(LinkContext);
  const { setStatusMessage } = useContext(StatusBarContext);
  const history = useHistory();

  const handleUnlink = async (institution: InstitutionProps) => {
    window.confirm(
      `
        Unlinking an institution will prevent it from being updated automatically.\n
        Are you sure you want to unlink ${institution.name}?
      `
    ) && LinkIpc.unlinkInstitution(institution.id);
  };

  useEffect(() => {
    LinkIpc.getHeartbeat();

    !isOnline && setStatusMessage(serverErrorStatusMessage);

    ipcRenderer.on(LINK_UNLINK_INSTITUTION_ACK, (_, statusMessage: StatusMessageProps) => {
      setStatusMessage(statusMessage);
    });

    return () => {
      ipcRenderer.removeAllListeners(LINK_UNLINK_INSTITUTION_ACK);
    };
  }, []);

  return (
    <ScrollView title="Canutin Link" headerNav={<HeaderButtons />} wizard={!profile}>
      {!profile && (
        <SectionRow>
          <UserAuthForm endpoint={ApiEndpoints.USER_LOGIN} />
        </SectionRow>
      )}

      {profile && (
        <>
          <Section title="Summary">
            <EmptyCard message={`Logged in as: ${profile.email}`} />
          </Section>
          <Section title={`Linked institutions / ${institutions ? institutions.length : 0}`}>
            {institutions && institutions.length > 0 ? (
              <Institutions>
                {institutions?.map(institution => {
                  return (
                    <Fieldset key={institution.id}>
                      <Institution>
                        <Label>Institution</Label>
                        <Value hasErrors={institution.errorTitle ? true : false}>
                          <span>{institution.name}</span>
                          <ButtonRow>
                            <Button onClick={() => handleUnlink(institution)}>Unlink</Button>
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
                        value={capitalize(formatRelativeDate(handleDate(institution.lastUpdate)))}
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
