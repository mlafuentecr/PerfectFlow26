import React, {useContext} from 'react';
import {View, Image, Linking} from 'react-native'; // Import Text component
import {ButtonStyled} from '../components/Button';
import {Logo} from '../components/Logo';
import {Section} from '../components/Section';
import styled from 'styled-components/native';
import PageInternal from '../components/PageInternal';
import ThemeContext, {AppStateType} from '../hooks/ThemeContext';

import {
  TitleStyled,
  DescriptionStyled,
  Container,
} from '../components/GlobalStyles';

interface NavigationProps {
  navigation: any;
  route: any;
}

const Start = ({navigation, route}: NavigationProps) => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const benefitsInfo = contextTheme?.data?.benefits || null;

  return (
    <PageInternal route={route}>
      <Container>
        <Logo />
        <DescriptionStyled style={{minHeight: 50}} alignText="center">
          WELCOME{' '}
        </DescriptionStyled>
        <TitleStyled alignText="center">
          It’s Time to Try A {'\n'} Relaxing Experience
        </TitleStyled>
        <View style={{minHeight: 50}}></View>
        <Section alignText="center">I’m able to use the app with ads</Section>
        <ButtonStyled
          color="green"
          onPress={() => navigation.navigate('HomePage')}>
          <Section alignText="center">Start your experience</Section>
        </ButtonStyled>
        <ButtonStyled
          color="transparent"
          onPress={() =>
            Linking.openURL(
              benefitsInfo.linktitle.url || 'https://perfecten.store/',
            )
          }>
          <Section alignText="center">Not a member yet?</Section>
        </ButtonStyled>

        <ViewImgDecor>
          <ImgDecor source={require('../assets/images/ring.png')} />
        </ViewImgDecor>
      </Container>
    </PageInternal>
  );
};

const ViewImgDecor = styled(View)`
  position: absolute;
  flex: 1;
  bottom: 0;
`;

const ImgDecor = styled(Image)``;
export default Start;
