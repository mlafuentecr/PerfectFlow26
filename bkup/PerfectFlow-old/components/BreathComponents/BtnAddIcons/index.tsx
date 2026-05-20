import React, {useContext} from 'react';
import {Image, TouchableOpacity, Text} from 'react-native';
import styled from 'styled-components/native';
import SoundSelected from '../../SoundSelectedIcons';
import BreathContext, {BreathStateType} from '../../../hooks/BreathContext';
import ThemeContext, {AppStateType} from '../../../hooks/ThemeContext';
import useMessage from '../../../hooks/useMessage';

const BtnAddIcons = () => {
  const breathContext = useContext<BreathStateType | undefined>(BreathContext);
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const Message = useMessage();
  const handleEditClick = () => {
    //Stop Breath
    contextTheme?.setIsRunning(false);
    breathContext?.setTabButton('Sounds');
    breathContext?.setDialogOpened(!breathContext?.DialogOpened);
  };
  return (
    <BreathIconsStyled onPress={() => handleEditClick()}>
      <ImageClose
        resizeMode="contain"
        source={require('../../../assets/images/icon_edit.png')}
      />
      <SoundSelected />
      <TextWrap>{Message}</TextWrap>
    </BreathIconsStyled>
  );
};

const BreathIconsStyled = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  border-radius: 5px;
  position: relative;
  min-height: 10px;
  padding: 10px;
`;

const TextWrap = styled(Text)`
  color: white;
  width: 100%;
  display: flex;
  text-align: center;
  padding: 5px;
`;

const ImageClose = styled(Image)`
  margin-right: 10px;
  margin-top: -5px;
  position: absolute;
  right: 25px;
  top: 15px;
  z-index: 10;
  width: 25px;
`;

export default BtnAddIcons;
