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

const Learn = ({route}: NavigationProps) => {
  const info = useContext<AppStateType | undefined>(ThemeContext);

  // Check if data exists before accessing it
  const dataArr = info?.data?.learn || null;

  return (
    <PageInternal route={route}>
      <ScrollView>
        <Container>
          <ButtonClose />
          <TitleLargeStyled>Learn</TitleLargeStyled>

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

export default Learn;
