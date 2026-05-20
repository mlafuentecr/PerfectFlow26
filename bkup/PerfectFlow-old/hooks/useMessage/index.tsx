import {useContext, useEffect, useState} from 'react';
import BreathContext, {BreathStateType} from '../BreathContext';
import ThemeContext, {AppStateType} from '../ThemeContext';

const useMessage = () => {
  const breathContext = useContext<BreathStateType | undefined>(BreathContext);
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);

  const [message, setMessage] = useState('');
  const iconsSelected = Object.keys(breathContext?.SelectedSounds || {}).length;
  const selectedTechniqueTitle = contextTheme?.selectedTechnique;

  useEffect(() => {
    iconsSelected > 0
      ? setMessage('')
      : setMessage('Please click here to \nselect a sound ');
  }, [iconsSelected, message, selectedTechniqueTitle]);
  return message;
};

export default useMessage;
