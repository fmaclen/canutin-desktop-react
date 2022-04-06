import React, { useContext, useEffect } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import styled from 'styled-components';
import { useForm, SubmitHandler } from 'react-hook-form';

import {
  LINK_CREATE_ACCOUNT_ACK,
  LINK_LOGIN_ACK,
  UserAuthProps,
  UserAuthResponseProps,
} from '@constants/link';
import { LinkContext } from '@app/context/linkContext';
import { ApiEndpoints } from '@app/data/canutinLink.api';
import { serverErrorStatusMessage, StatusBarContext } from '@app/context/statusBarContext';
import { StatusEnum } from '@appConstants/misc';
import { capitalize } from '@app/utils/strings.utils';

import Form from '@app/components/common/Form/Form';
import Fieldset from '@app/components/common/Form/Fieldset';
import InputTextField from '@app/components/common/Form/InputTextField';
import FormFooter from '@app/components/common/Form/FormFooter';
import SubmitButton from '@app/components/common/Form/SubmitButton';
import Section from '@app/components/common/Section';
import FieldNotice from '@app/components/common/Form/FieldNotice';
import InlineCheckbox from '@app/components/common/Form/Checkbox';
import Field from '@app/components/common/Form/Field';
import LinkIpc from '@app/data/link.ipc';

import { fieldNoticeParagraph } from './styles';

interface UserAuthFormProps {
  endpoint: ApiEndpoints;
}

const FieldNoticeParagraph = styled.p`
  ${fieldNoticeParagraph}
`;

const UserAuthForm = ({ endpoint }: UserAuthFormProps) => {
  const { setIsSyncing } = useContext(LinkContext);
  const { setStatusMessage } = useContext(StatusBarContext);
  const {
    register: registerAuthForm,
    handleSubmit: handleLoginSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<UserAuthProps>();

  const login = watch('login');
  const password = watch('password');
  const submitDisabled = !login || !password;
  const sectionLabel = endpoint === ApiEndpoints.USER_LOGIN ? 'Login' : 'Create account';

  useEffect(() => {
    const handleResponse = (response: UserAuthResponseProps) => {
      switch (response.status) {
        case 200:
          setIsSyncing(true);
          LinkIpc.getSummary();
          break;
        case 401:
          response.error &&
            setError(response.error[0] as keyof UserAuthProps, {
              type: 'server',
              message: response.error[1],
            });
          break;
        default:
          setStatusMessage(serverErrorStatusMessage);
      }
    };

    ipcRenderer.on(LINK_LOGIN_ACK, (_: IpcRendererEvent, response: UserAuthResponseProps) => {
      handleResponse(response);
    });
    ipcRenderer.on(
      LINK_CREATE_ACCOUNT_ACK,
      (_: IpcRendererEvent, response: UserAuthResponseProps) => {
        handleResponse(response);
      }
    );

    return () => {
      ipcRenderer.removeAllListeners(LINK_LOGIN_ACK);
      ipcRenderer.removeAllListeners(LINK_CREATE_ACCOUNT_ACK);
    };
  }, []);

  const formSubmit: SubmitHandler<UserAuthProps> = userAuth => {
    endpoint === ApiEndpoints.USER_LOGIN
      ? LinkIpc.login(userAuth)
      : LinkIpc.createAccount(userAuth);
  };

  return (
    <Section title={sectionLabel}>
      <Form onSubmit={handleLoginSubmit(formSubmit)} role="form">
        <Fieldset>
          {endpoint === ApiEndpoints.USER_LOGIN && (
            <FieldNotice
              title="What is Canutin Link?"
              description={
                <>
                  <FieldNoticeParagraph>
                    Canutin Link is a subscription service that allows you to link your banking
                    institutions and automatically sync your assets, accounts or transactions with
                    your vault.
                  </FieldNoticeParagraph>
                  <FieldNoticeParagraph>
                    <strong>We are currently in beta </strong> but you can click on the button above
                    to create an account and join the waitlist today.
                  </FieldNoticeParagraph>
                </>
              }
            />
          )}

          {endpoint === ApiEndpoints.USER_CREATE_ACCOUNT && (
            <FieldNotice
              title="Join private beta"
              description={
                <>
                  <FieldNoticeParagraph>
                    You can join the waitlist by creating an account below.
                    <strong> We are working hard to let everyone in as soon as possible</strong>.
                  </FieldNoticeParagraph>
                </>
              }
            />
          )}
        </Fieldset>
        <Fieldset>
          <InputTextField
            label="Email"
            name="login"
            type="email"
            register={registerAuthForm}
            required
            status={
              errors.login && {
                status: StatusEnum.NEGATIVE,
                message: errors.login.message && capitalize(errors.login.message),
              }
            }
          />
          <InputTextField
            label="Password"
            name="password"
            type="password"
            register={registerAuthForm}
            required
            status={
              errors.password && {
                status: StatusEnum.NEGATIVE,
                message: errors.password.message && capitalize(errors.password.message),
              }
            }
          />

          {sectionLabel === 'Create account' && (
            <Field label="Terms &amp; conditions" name="agreeToTerms">
              <InlineCheckbox
                name="legal"
                id="legal"
                label="I agree to Terms of Service &amp; Privacy Policy"
                register={registerAuthForm}
              />
            </Field>
          )}
        </Fieldset>
        <FormFooter>
          <SubmitButton disabled={submitDisabled}>{sectionLabel}</SubmitButton>
        </FormFooter>
      </Form>
    </Section>
  );
};

export default UserAuthForm;
