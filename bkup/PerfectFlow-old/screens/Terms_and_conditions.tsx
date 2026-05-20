import React, {useContext} from 'react';
import {View} from 'react-native';
import PageInternal from '../components/PageInternal';
import {TitleLargeStyled, COLORS, Container} from '../components/GlobalStyles';
import {ButtonClose} from '../components/ButtonClose';

import ThemeContext, {AppStateType} from '../hooks/ThemeContext';
import HTML from 'react-native-render-html';
import {ScrollView} from 'react-native';

const htmlStyle = {
  fontSize: 18,
  color: COLORS.white,
};

const TermsAndConditions = () => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const termsAndConditionsContent =
    contextTheme?.data?.terms_and_conditions ||
    'Visit our site perfecten.store';
  console.log(contextTheme?.width, 'terms ');
  return (
    <PageInternal route={''}>
      <ScrollView>
        <Container>
          <ButtonClose />
          <TitleLargeStyled>Terms and Conditions</TitleLargeStyled>
          <View style={{marginTop: 24}}>
            <HTML
              contentWidth={contextTheme?.width}
              baseStyle={htmlStyle}
              source={{html: termsAndConditionsContent}}
            />
          </View>
        </Container>
      </ScrollView>
    </PageInternal>
  );
};

export default TermsAndConditions;
