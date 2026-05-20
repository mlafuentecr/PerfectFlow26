import React, {useContext} from 'react';
import {ImageBackground, View, TouchableOpacity, Text} from 'react-native';
import styled from 'styled-components/native';
import ThemeContext, {AppStateType} from '../../hooks/ThemeContext';

const Footer = () => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);

  const toggleBreathing = () => {
    contextTheme?.setIsRunning((prevIsRunning: any) => !prevIsRunning);
  };

  return (
    <FooterWrap>
      <BgImgStyled source={require('../../assets/images/wave2.png')} />
      <FooterButtonStyled onPress={toggleBreathing}>
        <FooterText>{contextTheme?.isRunning ? 'Stop' : 'Start'}</FooterText>
      </FooterButtonStyled>
    </FooterWrap>
  );
};

const FooterWrap = styled(View)`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
  z-index: 10;

  position: absolute;
  bottom: 0%;
`;
const BgImgStyled = styled(ImageBackground)`
  flex: 1;
  display: flex;
  flex-direction: row;
  animation: 0.7s all;
`;

const FooterButtonStyled = styled(TouchableOpacity)`
  width: 20%;
  height: 100%;
  position: absolute;
  left: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FooterText = styled(Text)`
  color: white;
  font-weight: 700;
  font-size: 18px;
  text-transform: uppercase;
`;

export default Footer;
