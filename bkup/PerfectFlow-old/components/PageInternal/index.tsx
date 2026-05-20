import React, {ReactNode, useContext} from 'react';
import {SafeAreaView, View} from 'react-native';
import ThemeContext, {AppStateType} from '../../hooks/ThemeContext';
import styled from 'styled-components/native';
import backgrounds from '../Data/Array_backgrounds';

type PageProps = {
  children: ReactNode;
  route: any;
};

const Index: React.FC<PageProps> = ({children}) => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);

  if (!contextTheme) {
    return null;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageInternalImage
        resizeMode="cover"
        blurRadius={5}
        source={backgrounds.images[contextTheme.backgroundImage]}>
        <ViewStyled>{children}</ViewStyled>
      </PageInternalImage>
    </SafeAreaView>
  );
};

const PageInternalImage = styled.ImageBackground`
  flex: 1;
  height: 100%;
  background-color: black;
`;

const ViewStyled = styled(View)`
  flex: 1;
`;

export default Index;
