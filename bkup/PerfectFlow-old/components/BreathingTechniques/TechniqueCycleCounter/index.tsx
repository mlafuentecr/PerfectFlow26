import {useContext} from 'react';
import ThemeContext, {AppStateType} from '../../../hooks/ThemeContext';

import {TQTextRegularStyle, TQTextBoldStyle} from '../../GlobalStyles';
interface TechniqueCycleCounterProps {
  cycleCount: number;
  breathPhase: string;
  timer: number;
}

const TechniqueCycleCounter: React.FC<TechniqueCycleCounterProps> = ({
  cycleCount,
  breathPhase,
  timer,
}) => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const AditionalText =
    contextTheme?.selectedTechnique === 'Alternate Nostril Breathing'
      ? '( one nostril )'
      : '';

  return (
    <>
      <TQTextRegularStyle>Cycle {cycleCount + 1} of 4</TQTextRegularStyle>
      <TQTextBoldStyle BreathPhase={breathPhase}>{breathPhase}</TQTextBoldStyle>
      <TQTextRegularStyle>{AditionalText}</TQTextRegularStyle>
      <TQTextRegularStyle>{timer}s</TQTextRegularStyle>
    </>
  );
};

export default TechniqueCycleCounter;
