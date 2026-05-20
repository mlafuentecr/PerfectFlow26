import {Text, Image, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import styled from 'styled-components/native';
import ThemeContext, {AppStateType} from '../../hooks/ThemeContext';

interface FooterButtonProps {
  link: string;
  image: any;
  navigation: any;
}

const FooterButton = ({link, image, navigation}: FooterButtonProps) => {
  const context = useContext<AppStateType | undefined>(ThemeContext);

  const handleClick = () => {
    if (context) {
      context.setmenuChoose(link);
      navigation.navigate(link);
    }
  };

  return (
    <FooterButtonStyled onPress={() => handleClick()}>
      <FooterImg source={image} resizeMode="contain" />
      <FooterText>{link}</FooterText>
    </FooterButtonStyled>
  );
};
const FooterButtonStyled = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33%;
  bottom: 0px;
  height: 100px;
`;
const FooterText = styled(Text)`
  color: white;
`;
const FooterImg = styled(Image)`
  max-width: 20px;
  max-height: 20px;
`;

export default FooterButton;
