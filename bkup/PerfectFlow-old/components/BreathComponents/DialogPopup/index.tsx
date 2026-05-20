import {View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
// import Backgrounds from '../Tab_Backgrounds';
import Techniques from '../../BreathingTechniques';
import Volumen from '../Tab_Volumen';
import Sounds from '../Tab_Sounds';
import BreathContext, {BreathStateType} from '../../../hooks/BreathContext';

export default function Index() {
  const [DialogSelected, setDialogSelected] = useState(<View />);
  const breathContext = useContext<BreathStateType | undefined>(BreathContext);
  useEffect(() => {
    switch (breathContext?.TabButton) {
      case 'Sounds':
        setDialogSelected(<Sounds />);
        break;
      case 'Volumen':
        setDialogSelected(<Volumen />);
        break;
      case 'Techniques':
        setDialogSelected(<Techniques />);
        break;
      case '':
        setDialogSelected(<Techniques />);
        break;
    }
  }, [breathContext?.TabButton]);

  // Depending on what was clicked, the appropriate screen will be loaded
  return DialogSelected;
}
