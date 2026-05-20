import React, {useContext} from 'react';
import {View, useWindowDimensions} from 'react-native';
import PageInternal from '../components/PageInternal';
import {TitleInternStyled, COLORS, Container} from '../components/GlobalStyles';
import {ButtonClose} from '../components/ButtonClose';

import ThemeContext, {AppStateType} from '../hooks/ThemeContext';
import HTML from 'react-native-render-html';
import {ScrollView} from 'react-native';

const Acknowledgment = () => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const PrivacyContent = contextTheme?.data?.acknowledgment || '';
  const {width} = useWindowDimensions();

  const htmlStyle = {
    fontSize: 18,
    color: COLORS.white,
  };

  return (
    <PageInternal route={''}>
      <ScrollView>
        <Container>
          <ButtonClose />
          <TitleInternStyled>Acknowledgment</TitleInternStyled>
          <View style={{marginTop: 40}}>
            <HTML
              contentWidth={width}
              baseStyle={htmlStyle}
              source={{html: PrivacyContent}}
            />
          </View>
        </Container>
      </ScrollView>
    </PageInternal>
  );
};

export default Acknowledgment;
