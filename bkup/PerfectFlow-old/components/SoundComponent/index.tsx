import React, {useContext, useState} from 'react';
import {Image, TouchableOpacity, Text, View} from 'react-native';
import BreathContext, {BreathStateType} from '../../hooks/BreathContext';
import Imgs_and_snd, {soundInstances} from '../Data/Array_images_sounds';
import styled from 'styled-components/native'; // Import styled from the correct path
import Slider from '@react-native-community/slider';

const SoundComponent = ({soundName}: {soundName: string}) => {
  const breathContext = useContext<BreathStateType | undefined>(BreathContext);
  const [sliderVolume, setSliderVolume] = useState(0.9);
  const stopAndRemoveSound = (soundName: string) => {
    if (breathContext?.SelectedSounds) {
      soundInstances[soundName].stop();
      breathContext?.setSelectedSounds((prevSelectedSounds: string[]) =>
        prevSelectedSounds.filter((item: string) => item !== soundName),
      );
    }
  };

  const fixSound = (value: number) => {
    soundInstances[soundName].setVolume(value);
    setSliderVolume(value);
  };

  if (breathContext?.TabButton === 'Volumen') {
    return (
      <DialogSlider>
        <ImageStyled
          resizeMode="stretch"
          source={Imgs_and_snd[soundName].image}
        />

        <Slider
          style={{
            width: '70%',
            height: 40,
            marginLeft: 10,
            zIndex: 99,
          }}
          value={sliderVolume}
          onValueChange={fixSound}
          step={0.1}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#f3f3f3"
        />
        <ButtonX onPress={() => stopAndRemoveSound(soundName)}>
          <TextStyledX>X</TextStyledX>
        </ButtonX>
      </DialogSlider>
    );
  }

  return (
    <Button onPress={() => stopAndRemoveSound(soundName)}>
      <ImageStyled
        resizeMode="stretch"
        source={Imgs_and_snd[soundName].image}
      />
      <TextStyled>X</TextStyled>
    </Button>
  );
};

const DialogSlider = styled(View)`
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  align-content: center;
  height: 50px;
  padding: 0px;
  margin: 0px;
  border: 1px solid #aeaeae7b;
  background-color: #0f316a3e;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 5px;
  margin-right: 5px;
  padding-left: 15px;
  padding-right: 15px;
  flex-direction: row;
  z-index: 99;
  width: 100%;
`;
// const DialogSubTitle2 = styled(View)`
//   position: relative;
//   display: flex;
//   justify-content: space-around;
//   align-items: center;
//   align-content: center;
//   padding: 0px;
//   margin: 0px;
//   flex-direction: row;
//   z-index: 99;
//   border: 2px solid red;
// `;
const ImageStyled = styled(Image)`
  width: 40px;
  height: 40px;
  z-index: 1;
`;
const Button = styled(TouchableOpacity)`
  position: relative;
  display: flex;
  width: 40px;
  height: 40px;
  padding: 0px;
  margin: 0px;
  border: 1px solid #b6c9077a;
  border-radius: 10px;
  background-color: #0f316a3e;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 5px;
  margin-right: 5px;
  flex-direction: row;
  justify-content: space-around;
`;

const TextStyled = styled(Text)`
  position: absolute;
  top: -5px;
  right: -5px;
  color: #161654;
  background-color: white;
  border-radius: 50px;
  width: 15px;
  height: 15px;
  line-height: 15px;
  padding: 1px;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  font-weight: 700;
`;
const ButtonX = styled(TouchableOpacity)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  padding: 0px;
  margin: 5px;
  border: 1px solid #aeaeae7b;
  border-radius: 10px;
  background-color: #0f316a3e;
`;
const TextStyledX = styled(Text)`
  position: relative;
  color: #161654;
  background-color: white;
  border-radius: 50px;
  width: 15px;
  height: 15px;
  line-height: 15px;
  padding: 1px;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  font-weight: 700;
`;
export default SoundComponent;
