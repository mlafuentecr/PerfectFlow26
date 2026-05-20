import React, {useContext, useEffect, useState} from 'react';
import {ImageBackground, View, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import FooterButton from '../FooterButton';
import ThemeContext, {AppStateType} from '../../hooks/ThemeContext';

interface NavigationProps {
  navigation: any;
  route: any;
}

const Footer = ({navigation, route}: NavigationProps) => {
  const [wavePos, setWavePos] = useState('0%');
  const context = useContext<AppStateType | undefined>(ThemeContext);

  useEffect(() => {
    if (context) {
      switch (context.menuChoose) {
        case 'Settings':
          setWavePos('33%');
          break;
        case 'Benefits':
          setWavePos('-33%');
          break;
        default:
          setWavePos('0%');
          break;
      }
    }
  }, [context]);

  return (
    <FooterWrap
      style={{
        display:
          route.name === 'Learn' ||
          route.name === 'Help' ||
          route.name === 'Settings'
            ? 'none'
            : 'flex',
      }}>
      <BgImgStyled
        leftPos={wavePos}
        source={require('../../assets/images/wave2.png')}
      />

      <View style={styles.menu}>
        <FooterButton
          navigation={navigation}
          image={require('../../assets/images/icon-info.png')}
          link={'Benefits'}
        />

        <FooterButton
          navigation={navigation}
          image={require('../../assets/images/icon-win.png')}
          link={'Breath'}
        />

        <FooterButton
          navigation={navigation}
          image={require('../../assets/images/icon-settings.png')}
          link={'Settings'}
        />
      </View>
    </FooterWrap>
  );
};

interface ImgStyledProps {
  leftPos: string;
}

const styles = StyleSheet.create({
  menu: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    top: 0,
    minWidth: '100%',
  },
});

const FooterWrap = styled(View)`
  position: absolute;
  display: flex;
  flex-direction: row;
  min-width: 100%;
  bottom: 0px;
  height: 100px;
  z-index: 10;
`;

const BgImgStyled = styled(ImageBackground)<ImgStyledProps>`
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  animation: 0.7s all;
  position: relative;
  left: ${props => props.leftPos};
`;

export default Footer;
