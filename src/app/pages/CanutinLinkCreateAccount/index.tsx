import React, { useContext } from 'react';

import { LinkContext } from '@app/context/linkContext';
import { ApiEndpoints } from '@app/data/canutinLink.api';

import ScrollView from '@components/common/ScrollView';
import HeaderButtons from '@app/components/CanutinLink/HeaderButtons';
import UserAuthForm from '@app/components/CanutinLink/UserAuthForm';
import SectionRow from '@app/components/common/SectionRow';

const CanutinLinkCreateAccount = () => {
  const { profile } = useContext(LinkContext);

  return (
    <ScrollView title="Canutin Link" headerNav={<HeaderButtons />} wizard={true}>
      <SectionRow>
        {!profile && <UserAuthForm endpoint={ApiEndpoints.USER_CREATE_ACCOUNT} />}
      </SectionRow>
    </ScrollView>
  );
};

export default CanutinLinkCreateAccount;
