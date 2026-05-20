import {useContext, useEffect, useCallback, useState, useMemo} from 'react';
import {Animated} from 'react-native';
import ThemeContext, {AppStateType} from '../../hooks/ThemeContext';
import {useBreathingTimes} from '../../hooks/useBreathingTimes';

export default function useBoxBreathingLogic() {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const {Times} = useBreathingTimes();

  const [breathPhase, setBreathPhase] = useState<'Breath' | 'Hold' | 'Exhale'>(
    'Breath',
  );
  const [breathDuration, setBreathDuration] = useState(4000); // 4 seconds for inhale
  const [timer, setTimer] = useState(breathDuration / 1000);
  const [cycleCount, setCycleCount] = useState(0);

  const startBreathing = useCallback(() => {
    contextTheme?.setIsRunning(true);
    setTimer(breathDuration / 1000);
  }, [contextTheme, breathDuration]);

  const stopBreathing = useCallback(() => {
    contextTheme?.setIsRunning(false);
  }, [contextTheme]);

  const resetBreathing = useCallback(() => {
    setCycleCount(0);
    setTimer(breathDuration / 1000);
  }, [breathDuration]);

  const finishBreathing = useCallback(() => {
    contextTheme?.setFinished(true);
    resetBreathing();
  }, [resetBreathing, contextTheme]);

  useEffect(() => {
    contextTheme?.isRunning ? startBreathing() : stopBreathing();
  }, [contextTheme?.isRunning, startBreathing, stopBreathing]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (contextTheme?.isRunning && cycleCount < 4) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            if (breathPhase === 'Breath') {
              setBreathPhase('Hold');
              setBreathDuration(
                Times[contextTheme?.selectedTechnique]?.Hold || 4,
              ); // Hold: 7s
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              setBreathDuration(
                Times[contextTheme?.selectedTechnique]?.Exhale || 4,
              ); // Exhale: 8s
            } else {
              setBreathPhase('Breath');
              setBreathDuration(
                Times[contextTheme?.selectedTechnique]?.Breath || 4,
              ); // Breath: 4s
              setCycleCount(cycleCount + 1);
            }
            return breathDuration / 1000;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else {
      contextTheme?.setIsRunning(false);
      if (cycleCount === 4) finishBreathing();
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    contextTheme,
    cycleCount,
    breathDuration,
    breathPhase,
    resetBreathing,
    finishBreathing,
    Times,
  ]);

  //amimation
  const scaleValue = useMemo(() => new Animated.Value(1), []);
  useEffect(() => {
    let scaleTo = breathPhase === 'Breath' ? 1.1 : 0.8;

    if (contextTheme?.isRunning && breathPhase !== 'Hold') {
      Animated.timing(scaleValue, {
        toValue: scaleTo,
        duration: breathDuration,
        useNativeDriver: false,
      }).start();
    } else {
      scaleTo = 1;
      scaleValue.setValue(scaleTo);
    }
  }, [breathPhase, scaleValue, breathDuration, contextTheme?.isRunning]);
  //amimation End

  return {
    breathPhase,
    breathDuration,
    timer,
    cycleCount,
    contextTheme,
    setBreathPhase,
    setBreathDuration,
    setCycleCount,
    scaleValue,
  };
}
