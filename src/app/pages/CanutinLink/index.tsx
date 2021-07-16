import React, { useContext } from 'react';

import { AppContext } from '@app/context/appContext';
import { ApiEndpoints } from '@app/data/canutinLink.api';

import ScrollView from '@components/common/ScrollView';
import HeaderButtons from '@app/components/CanutinLink/HeaderButtons';
import UserAuthForm from '@app/components/CanutinLink/UserAuthForm';

const CanutinLink = () => {
  const { isUserLoggedIn } = useContext(AppContext);

  return (
    <ScrollView title="Canutin Link" headerNav={<HeaderButtons />}>
      {!isUserLoggedIn && <UserAuthForm endpoint={ApiEndpoints.USER_LOGIN} />}
    </ScrollView>
  );
};

export default CanutinLink;
