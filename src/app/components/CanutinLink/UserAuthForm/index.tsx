import React, { useContext, useEffect } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useForm, SubmitHandler } from 'react-hook-form';
import styled from 'styled-components';

import LinkIpc from '@app/data/link.ipc';
import { ApiEndpoints, LINK_CREATE_ACCOUNT_ACK, LINK_LOGIN_ACK } from '@constants/link';
import { LinkContext } from '@app/context/linkContext';
import { UserAuthProps, UserAuthResponseProps } from '@appTypes/canutinLink.type';
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
import TextLink from '@app/components/common/TextLink';

import { fieldNoticeParagraph } from './styles';

interface UserAuthFormProps {
  endpoint: ApiEndpoints;
}

const TermsContainer = styled.div`
  font-size: 12px;
`;

const FieldNoticeParagraph = styled.p`
  ${fieldNoticeParagraph}
`;

const AgreeToTerms = () => {
  return (
    <TermsContainer>
      I agree to the&nbsp;
      <TextLink
        isExternal={true}
        pathname="https://canutin.com/terms-of-service/"
        label="Terms of serivce"
      />
      &nbsp;&amp;&nbsp;
      <TextLink
        isExternal={true}
        pathname="https://canutin.com/privacy-policy/"
        label="Privacy policy"
      />
    </TermsContainer>
  );
};

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
  const legal = watch('legal');
  const submitDisabled =
    !login || !password || (endpoint === ApiEndpoints.USER_CREATE_ACCOUNT && !legal);
  const sectionLabel = endpoint === ApiEndpoints.USER_LOGIN ? 'Login' : 'Create account';

  useEffect(() => {
    const handleResponse = (response: UserAuthResponseProps) => {
      switch (response.status) {
        case 200:
          setIsSyncing(true);
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
                  <FieldNoticeParagraph>
                    Find out more at{' '}
                    <TextLink
                      isExternal={true}
                      pathname="https://canutin.com"
                      label="Canutin.com"
                    />
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
                label={<AgreeToTerms />}
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
