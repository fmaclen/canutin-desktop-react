import React, { useContext } from 'react';
import styled from 'styled-components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import canutinLinkApi, { ApiEndpoints, requestLinkSummary } from '@app/data/canutinLink.api';
import { routesPaths } from '@app/routes';
import { AppContext } from '@app/context/appContext';
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

interface UserAuthProps {
  login: string;
  password: string;
  confirmPassword?: string;
}

interface UserAuthFormProps {
  endpoint: ApiEndpoints;
}

const FieldNoticeParagraph = styled.p`
  margin-top: 12px;
  margin-bottom: 12px;

  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

const UserAuthForm = ({ endpoint }: UserAuthFormProps) => {
  const { linkAccount, setLinkAccount } = useContext(AppContext);
  const { setStatusMessage } = useContext(StatusBarContext);
  const {
    register: registerAuthForm,
    handleSubmit: handleLoginSubmit,
    setError,
    formState: { errors },
  } = useForm<UserAuthProps>();
  const history = useHistory();

  const formSubmit: SubmitHandler<UserAuthProps> = async data => {
    canutinLinkApi
      .post(endpoint, data)
      .then(async response => {
        if (response.data.success) {
          const summary = await requestLinkSummary();
          summary && setLinkAccount(summary);
        }
        history.push(routesPaths.link);
      })
      .catch(e => {
        if (e.response) {
          setError(e.response.data['field-error'][0], {
            type: 'server',
            message: e.response.data['field-error'][1],
          });
        } else {
          linkAccount &&
            setLinkAccount({
              ...linkAccount,
              errors: { user: true, institution: false },
              isSyncing: false,
            });
          setStatusMessage(serverErrorStatusMessage);
        }
      });
  };

  const userAuthLabel = endpoint === ApiEndpoints.USER_LOGIN ? 'Login' : 'Create account';

  return (
    <Section title={userAuthLabel}>
      <Form onSubmit={handleLoginSubmit(formSubmit)} role="form">
        <Fieldset>
          {userAuthLabel === 'Login' && (
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
          {userAuthLabel === 'Create account' && (
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
            status={
              errors.login && {
                status: StatusEnum.NEGATIVE,
                message: errors.login.message && capitalize(errors.login.message),
              }
            }
            required
          />
          <InputTextField
            label="Password"
            name="password"
            type="password"
            register={registerAuthForm}
            status={
              errors.password && {
                status: StatusEnum.NEGATIVE,
                message: errors.password.message && capitalize(errors.password.message),
              }
            }
            required
          />

          {userAuthLabel === 'Create account' && (
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
          <SubmitButton>{userAuthLabel}</SubmitButton>
        </FormFooter>
      </Form>
    </Section>
  );
};

export default UserAuthForm;
