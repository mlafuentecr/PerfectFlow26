import React, {useEffect, useRef, useCallback, useContext} from 'react';
import {TouchableOpacity, Image, Animated, View} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../GlobalStyles';
import BreathContext, {BreathStateType} from '../../../hooks/BreathContext';
import DialogPopup from '../DialogPopup';
import TabButton from '../TabButton';

const DialogBox = () => {
  const breathContext = useContext<BreathStateType | undefined>(BreathContext);
  const dialogPos = useRef(new Animated.Value(100)).current;

  const openDialog = useCallback(() => {
    Animated.timing(dialogPos, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [dialogPos]);

  const closeDialog = useCallback(() => {
    //back to defaulth
    breathContext?.setTabButton('Techniques');
    Animated.timing(dialogPos, {
      toValue: 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
    breathContext?.setDialogOpened(false);
  }, [dialogPos, breathContext]);

  useEffect(() => {
    breathContext?.DialogOpened ? openDialog() : closeDialog();
  }, [breathContext, openDialog, closeDialog]);

  const CloseBtn = () => {
    return (
      <CloseBtnStyle onPress={closeDialog}>
        <CloseImage
          source={require('../../../assets/images/Close.png')}
          resizeMode="cover"
        />
      </CloseBtnStyle>
    );
  };

  return (
    <DialogWrapper
      style={{
        top: dialogPos.interpolate({
          inputRange: [0, 100],
          outputRange: ['0%', '100%'],
        }),
      }}>
      <CloseBtn />
      <DialogMenu>
        <TabButton key={'Sounds'} text={'Sounds'} />
        <TabButton key={'Volumen'} text={'Volumen'} />
        <TabButton key={'BreathingTechniques'} text={'Techniques'} />
      </DialogMenu>
      <DialogPopup />
    </DialogWrapper>
  );
};

export {DialogBox};

const DialogWrapper = styled(Animated.View)`
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: ${COLORS.transparent2};
  width: 100%;
  height: 100%;
  z-index: 20;
  padding: 20px;
  left: 0px;
`;

const DialogMenu = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 25px;
  background-color: #161654;
`;

const CloseBtnStyle = styled(TouchableOpacity)`
  position: absolute;
  right: 20px;
  top: 5px;
  width: 40px;
  height: 40px;
  z-index: 10;
`;

const CloseImage = styled(Image)`
  z-index: 50;
  width: 30px;
  height: 30px;
  z-index: 10;
  margin: auto;
  margin-top: 5px;
`;
