import React, {useContext} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {NavigationContext} from '@react-navigation/native';
import styled from 'styled-components/native';
import ThemeContext, {AppStateType} from '../../../hooks/ThemeContext';
import BreathContext, {BreathStateType} from '../../../hooks/BreathContext';
import backgrounds from '../../Data/Array_backgrounds';

const BackgroundSelector: React.FC = () => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const context = useContext<BreathStateType | undefined>(BreathContext);
  const navigation = useContext(NavigationContext);

  const handleBackgroundChange = (key: any) => {
    context?.setDialogOpened(false);
    contextTheme?.setBackgroundImage(key);
    navigation?.navigate('Start');
  };

  const RenderImage = ({imageSource}: {key: number; imageSource: any}) => (
    <TouchableOpacityStyled onPress={() => handleBackgroundChange(imageSource)}>
      <ImageStyled source={imageSource} style={{resizeMode: 'cover'}} />
    </TouchableOpacityStyled>
  );

  return (
    <ScrollViewStyled>
      <ViewStyled>
        {backgrounds.images.map((image, index) => (
          <RenderImage key={index} imageSource={image} />
        ))}
      </ViewStyled>
    </ScrollViewStyled>
  );
};

export default BackgroundSelector;

const ScrollViewStyled = styled(ScrollView)``;

const ViewStyled = styled(View)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 10px;
`;

const TouchableOpacityStyled = styled(TouchableOpacity)`
  display: flex;
  border: 1px solid #f3f3f3;
  width: 30%;
`;

const ImageStyled = styled.Image`
  height: 150px;
  width: 100%;
`;
