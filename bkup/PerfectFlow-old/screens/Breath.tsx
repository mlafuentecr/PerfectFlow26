// Breath.js
import React, {useState} from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import BreathContext, {BreathStateType} from '../hooks/BreathContext';
import PageInternal from '../components/PageInternal';
import {useRoute} from '@react-navigation/native';
import {Container, TitleLargeStyled} from '../components/GlobalStyles';
import {ButtonClose} from '../components/ButtonClose';
import FooterBreath from '../components/FooterBreath';
import BtnAddIcons from '../components/BreathComponents/BtnAddIcons';
import {DialogBox} from '../components/BreathComponents/DialogBox';
import {TechniqueSwitch} from '../components/BreathingTechniques/TechniqueSwitch';

interface SoundInstances {
  [soundName: string]: any;
}

const Breath = () => {
  const route = useRoute();

  const [iconPlusState, seticonPlusState] = useState(false);
  const [DialogOpened, setDialogOpened] = useState(false);
  const [TabButton, setTabButton] = useState('Techniques');

  //Sound and Icons
  const [SelectedSounds, setSelectedSounds] = useState<string[]>([]);
  const [soundInstances, setSoundInstances] = useState<SoundInstances>({});

  return (
    <BreathContext.Provider
      value={
        {
          iconPlusState,
          seticonPlusState,
          DialogOpened,
          setDialogOpened,
          TabButton,
          setTabButton,
          SelectedSounds,
          setSelectedSounds,
          soundInstances,
          setSoundInstances,
        } as BreathStateType
      }>
      <PageInternal route={route}>
        <Container>
          <ButtonClose />
          <TitleLargeStyled>Breath</TitleLargeStyled>
          {/* Container  */}
          <ViewWrapStyled>
            <TechniqueSwitch />
            <BtnAddIcons />
          </ViewWrapStyled>
          {/* Container Ends */}
        </Container>
        <DialogBox />
        <FooterBreath />
      </PageInternal>
    </BreathContext.Provider>
  );
};

const ViewWrapStyled = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

export default Breath;
