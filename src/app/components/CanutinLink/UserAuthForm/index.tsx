import React, { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import canutinLinkApi, { ApiEndpoints, requestLinkSummary } from '@app/data/canutinLink.api';
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
import { routesPaths } from '@app/routes';

interface UserAuthProps {
  login: string;
  password: string;
  confirmPassword?: string;
}

interface UserAuthFormProps {
  endpoint: ApiEndpoints;
}

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
          if (summary) {
            setLinkAccount(summary);
          }
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
        </Fieldset>
        <FormFooter>
          <SubmitButton>{userAuthLabel}</SubmitButton>
        </FormFooter>
      </Form>
    </Section>
  );
};

export default UserAuthForm;
