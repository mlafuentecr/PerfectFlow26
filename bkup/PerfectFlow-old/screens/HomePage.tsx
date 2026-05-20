import React, { useContext } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import HTML from 'react-native-render-html';

import { Logo } from '../components/Logo';
import PageInternal from '../components/PageInternal';
import { COLORS, Container } from '../components/GlobalStyles';
import MenuProfile from '../components/MenuProfile';
import Footer from '../components/Footer';
import ThemeContext, { AppStateType } from '../hooks/ThemeContext';

interface NavigationProps {
  navigation: any;
  route: any;
}

const fallBackDescription = `xxxx`;

const HomePage = ({ navigation, route }: NavigationProps) => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const htmlContent = contextTheme?.data?.home ?? fallBackDescription;

  return (
    <PageInternal route={route}>
      <Container>
        <Logo size="small" />
        <MenuProfile navigation={navigation} />

        <DescriptionView>
          <HTML
            baseStyle={htmlStyle}
            contentWidth={contextTheme?.width || 360}
            source={{ html: htmlContent }}
          />
        </DescriptionView>
      </Container>

      <Footer navigation={navigation} route={route} />
    </PageInternal>
  );
};

const htmlStyle = {
  fontSize: 18,
  color: COLORS.white,
};

const DescriptionView = styled(View)`
  width: 100%;
  justify-content: flex-start;
`;

export default HomePage;
