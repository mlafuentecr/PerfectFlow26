import React, {useContext} from 'react';
import BreathContext, {BreathStateType} from '../../hooks/BreathContext';
import SoundComponent from '../../components/SoundComponent';
import {View} from 'react-native';
import {styled} from 'styled-components';

export default function Index() {
  const breathContext = useContext<BreathStateType | undefined>(BreathContext);
  const IconsCount = breathContext?.SelectedSounds.length;

  const SelectedIcons = () => {
    if (IconsCount > 0) {
      return breathContext?.SelectedSounds.map(
        (soundName: string, index: number) => (
          <SoundComponent key={index} soundName={soundName} />
        ),
      );
    }
    return null;
  };
  return (
    <Wrap style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      <SelectedIcons />
    </Wrap>
  );
}
const Wrap = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  display: flex;
  justify-content: space-around;
  max-width: 90%;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
`;
