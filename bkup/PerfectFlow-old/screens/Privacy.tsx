import React, {useContext} from 'react';
import {View} from 'react-native';
import PageInternal from '../components/PageInternal';
import {TitleLargeStyled, COLORS, Container} from '../components/GlobalStyles';
import {ButtonClose} from '../components/ButtonClose';

import ThemeContext, {AppStateType} from '../hooks/ThemeContext';
import HTML from 'react-native-render-html';
import {ScrollView} from 'react-native';

const Privacy = () => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const PrivacyContent = contextTheme?.data?.privacy_policy || '';

  const htmlStyle = {
    fontSize: 18,
    color: COLORS.white,
  };

  return (
    <PageInternal route={''}>
      <ScrollView>
        <Container>
          <ButtonClose />
          <TitleLargeStyled>Privacy</TitleLargeStyled>
          <View style={{marginTop: 40}}>
            <HTML
              contentWidth={contextTheme?.width}
              baseStyle={htmlStyle}
              source={{html: PrivacyContent}}
            />
          </View>
        </Container>
      </ScrollView>
    </PageInternal>
  );
};

export default Privacy;
