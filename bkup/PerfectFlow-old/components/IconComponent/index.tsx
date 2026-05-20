import React, {useContext} from 'react';
import {View} from 'react-native';
import {ImageStyled, Button} from './styles';
import Imgs_and_snd, {soundInstances} from '../Data/Array_images_sounds';
import BreathContext, {BreathStateType} from '../../hooks/BreathContext';

interface IconComponentProps {
  name: string;
}

const IconComponent: React.FC<IconComponentProps> = ({name}) => {
  const context = useContext<BreathStateType | undefined>(BreathContext);

  const PlaySound = (soundName: string) => {
    if (context?.SelectedSounds) {
      const soundInstance = soundInstances[soundName];
      if (soundInstance) {
        console.log('Playing sound:', soundName);
        soundInstance.setVolume(1);
        soundInstance.setNumberOfLoops(-1);

        try {
          soundInstance.play();
          console.log('Sound played successfully');
        } catch (error) {
          console.error('Error playing sound:', error);
        }

        context?.setSelectedSounds([...context.SelectedSounds, soundName]);
      } else {
        console.log('Sound instance not found for:', soundName);
      }
    }
  };

  const PushToArray = (name: string) => {
    const numberOfObjSlected = Object.keys(context?.SelectedSounds).length;
    console.log(numberOfObjSlected, 'lenght');

    if (!context?.SelectedSounds.includes(name) && numberOfObjSlected <= 4) {
      PlaySound(name);
    } else {
      console.log('el icono ya esta');
    }
  };

  return (
    <View style={{alignItems: 'center', zIndex: 99}}>
      <Button onPress={() => PushToArray(name)}>
        <ImageStyled resizeMode="stretch" source={Imgs_and_snd[name].image} />
      </Button>
    </View>
  );
};

export default IconComponent;
