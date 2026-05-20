import {useContext} from 'react';
import ThemeContext, {AppStateType} from '../../../hooks/ThemeContext';
import {TechniqueRandomChange} from '../TechniqueRandomChange';
import {TechniqueFinished} from '../TechniqueFinished';
import TechniqueCycleCounter from '../TechniqueCycleCounter';
import useBoxBreathingLogic from '../BoxBreathingLogic';
const Technique_Switcher = () => {
  const {cycleCount, breathPhase, timer} = useBoxBreathingLogic();
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);

  if (!contextTheme?.isRunning && !contextTheme?.finished) {
    return <TechniqueRandomChange />;
  }
  if (!contextTheme?.isRunning && contextTheme?.finished) {
    return <TechniqueFinished />;
  }
  return (
    <TechniqueCycleCounter
      cycleCount={cycleCount}
      breathPhase={breathPhase}
      timer={timer}
    />
  );
};

export {Technique_Switcher};
