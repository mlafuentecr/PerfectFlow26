import React, {useContext} from 'react';

import PageInternal from '../components/PageInternal';
import {ButtonClose} from '../components/ButtonClose';
import Card from '../components/Card';
import {
  Container,
  TitleInternStyled,
  TitleLargeStyled,
} from '../components/GlobalStyles';
import ThemeContext, {AppStateType} from '../hooks/ThemeContext';
import {ScrollView} from 'react-native';

interface NavigationProps {
  navigation: any;
  route: any;
}

const Faq = ({route}: NavigationProps) => {
  const info = useContext<AppStateType | undefined>(ThemeContext);

  const dataArr = info?.data?.faqs || null;

  return (
    <PageInternal route={route}>
      <ScrollView>
        <Container>
          <ButtonClose />
          <TitleLargeStyled>Faq</TitleLargeStyled>

          {dataArr ? (
            <Card dataArr={dataArr} />
          ) : (
            <TitleInternStyled>Error with servers</TitleInternStyled>
          )}
        </Container>
      </ScrollView>
    </PageInternal>
  );
};

export default Faq;
