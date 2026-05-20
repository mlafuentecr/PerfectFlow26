import React, {useContext} from 'react';
import {
  Image,
  Linking,
  TouchableOpacity,
  View,
  Platform,
  Text,
} from 'react-native';
import PageInternal from '../components/PageInternal';
import {
  TitleLargeStyled,
  SubTitleStyled,
  CardStyle,
  DescriptionStyled,
  Container,
  WhiteTextStyled,
} from '../components/GlobalStyles';
import {ButtonClose} from '../components/ButtonClose';

import ThemeContext, {AppStateType} from '../hooks/ThemeContext';
import HTML from 'react-native-render-html';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native';

interface NavigationProps {
  navigation: any;
  route: any;
}
const htmlStyle = {fontSize: 18, color: 'white'};
const callPhoneNumber = (phoneNumber: any) => {
  if (Platform.OS === 'android') {
    phoneNumber = `tel:${phoneNumber}`; // Error in this line
  } else {
    phoneNumber = `telprompt:${phoneNumber}`;
  }
  Linking.openURL(phoneNumber);
};

const Help = ({route}: NavigationProps) => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const helpInfo = contextTheme?.data?.get_help || null;

  return (
    <PageInternal route={route}>
      <ScrollView>
        <Container>
          <ButtonClose />
          <TitleLargeStyled>Need Help?</TitleLargeStyled>
          <View style={{marginTop: 40}}>
            <SubTitleStyled>{helpInfo?.title}</SubTitleStyled>

            <HTML
              contentWidth={contextTheme?.width}
              baseStyle={htmlStyle}
              source={{html: helpInfo?.description}}
            />

            <CardStyle>
              <TouchableStyled onPress={() => callPhoneNumber('+18002738255')}>
                <Image source={require(`../assets/images/icon-phone.png`)} />
                <DescriptionStyled>
                  <Image
                    source={require(`../assets/images/icon-flag-usa.png`)}
                  />
                  {'\n'} USA Toll free: {'\n'}+1-800-273-8255
                </DescriptionStyled>
              </TouchableStyled>
              <WhiteTextStyled>
                This helpline provides free and confidential support 24/7 to
                individuals in distress {'\n'}
              </WhiteTextStyled>
              <WhiteTextStyled>
                <Text style={{fontWeight: 'bold'}}>Crisis Text Line:</Text> Text
                "HELLO" to 741741 to connect with a trained crisis counselor via
                text. This service is available 24/7
              </WhiteTextStyled>
            </CardStyle>
            <CardStyle>
              <TouchableStyled onPress={() => callPhoneNumber('+18334564566')}>
                <Image source={require(`../assets/images/icon-phone.png`)} />
                <DescriptionStyled>
                  <Image
                    source={require(`../assets/images/icon-flag-canda.png`)}
                  />
                  {'\n'}Canada Toll free: {'\n'}+ 1-833-456-4566
                </DescriptionStyled>
              </TouchableStyled>
              <WhiteTextStyled>
                This helpline provides free and confidential support 24/7 to
                individuals in distress {'\n'}
              </WhiteTextStyled>
            </CardStyle>
          </View>
        </Container>
      </ScrollView>
    </PageInternal>
  );
};
const TouchableStyled = styled(TouchableOpacity)`
  display: flex;
  z-index: 2;
  height: 80px;
  flex-direction: row;
  gap: 20px;
  min-width: 100%;
`;

export default Help;
