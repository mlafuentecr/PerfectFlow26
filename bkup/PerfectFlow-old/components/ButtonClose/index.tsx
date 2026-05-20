import React, {useContext, useEffect} from 'react';
import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import ThemeContext, {AppStateType} from '../../hooks/ThemeContext';
import {NavigationContext, useRoute} from '@react-navigation/native';
import BreathContext, {BreathStateType} from '../../hooks/BreathContext';
import {soundInstances} from '../Data/Array_images_sounds';
const ButtonClose = () => {
  const breathContext = useContext<BreathStateType | undefined>(BreathContext);
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const CloseImg = require('../../assets/images/Close.png');

  const route = useRoute();
  const navigation = React.useContext(NavigationContext);

  useEffect(() => {
    if (route.name) {
      contextTheme?.setmenuChoose(route.name);
    }
  }, [route, contextTheme]);

  const stopAllSounds = () => {
    //stopAllSounds
    breathContext?.SelectedSounds.map((soundName: any) => {
      soundInstances[soundName].stop();
    });
    breathContext?.setSelectedSounds('');

    //Stop Breath
    contextTheme?.setIsRunning(false);
  };

  const handleClick = () => {
    if (
      route.name === 'Benefits' ||
      route.name === 'Breath' ||
      route.name === 'Settings'
    ) {
      setTimeout(
        function () {
          contextTheme?.setmenuChoose('HomePage');
        }.bind(this),
        1000,
      );
    }
    stopAllSounds();
    navigation?.goBack();
  };

  return (
    <View style={styles.Container}>
      <TouchableOpacity onPress={() => handleClick()}>
        <Image style={styles.closeImg} source={CloseImg} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    display: 'flex',
    position: 'absolute',
    justifyContent: 'flex-start',
    top: 30,
    right: 15,
    height: 60,
    zIndex: 10,
  },
  closeImg: {
    display: 'flex',
    height: 50,
    maxWidth: 219,
  },
});

export {ButtonClose};
