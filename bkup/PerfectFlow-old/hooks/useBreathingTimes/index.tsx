import {useContext, useMemo} from 'react';
import ThemeContext, {AppStateType} from '../ThemeContext';

export type TimesObject = {
  [key: string]: {
    Breath: number;
    Hold: number;
    Exhale: number;
  };
};

const useBreathingTimes = () => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);

  const Times: TimesObject = useMemo(() => {
    // Define your timing values here for each technique
    return {
      'Diaphragmatic Breathing': {
        Breath: 4000,
        Hold: 1000,
        Exhale: 4000,
      },
      'Box Breathing': {
        Breath: 4000,
        Hold: 4000,
        Exhale: 4000,
      },
      '4-7-8 Breathing': {
        Breath: 4000,
        Hold: 7000,
        Exhale: 8000,
      },
      'Alternate Nostril Breathing': {
        Breath: 7000,
        Hold: 7000,
        Exhale: 7000,
      },
    };
  }, []);

  const timesString = `Breath: ${
    Times[contextTheme?.selectedTechnique]?.Breath / 1000
  }s, Hold: ${Times[contextTheme?.selectedTechnique]?.Hold / 1000}s, Exhale: ${
    Times[contextTheme?.selectedTechnique]?.Exhale / 1000
  }s`;

  return {Times, timesString};
};

export {useBreathingTimes};
