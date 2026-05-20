import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components/native';
import ThemeContext, {AppStateType} from '../../../hooks/ThemeContext';

export default function BreathingTextComponent() {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const [breathPhase, setBreathPhase] = useState<'Breath' | 'Exhale'>('Breath');
  const [breathDuration, setBreathDuration] = useState(4000); // 4 seconds for inhale
  const [timer, setTimer] = useState(breathDuration / 1000);
  const [isInhale, setIsInhale] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);
  const scaleValue = useMemo(() => new Animated.Value(1), []);
  const startBreathing = useCallback(() => {
    contextTheme?.setIsRunning(true);
    setCycleCount(0);
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
    console.log('finish');
    contextTheme?.setFinished(true);
    resetBreathing();
  }, [resetBreathing, contextTheme]);

  useEffect(() => {
    contextTheme?.isRunning ? startBreathing : stopBreathing;
  }, [contextTheme?.isRunning, startBreathing, stopBreathing]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (contextTheme?.isRunning && cycleCount < 5) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            setIsInhale(prevIsInhale => !prevIsInhale);
            setBreathPhase(prevBreathPhase =>
              prevBreathPhase === 'Breath' ? 'Exhale' : 'Breath',
            );
            setBreathDuration(prevDuration =>
              prevDuration === 4000 ? 6000 : 4000,
            ); // Inhale: 4s, Exhale: 6s
            setCycleCount(prevCycleCount => prevCycleCount + 1);
            return breathDuration / 1000;
          }
          return prevTimer - 1;
        });
      }, 1000); // Update every 1 second
    } else {
      contextTheme?.setIsRunning(false);
      finishBreathing();
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    breathDuration,
    contextTheme,
    cycleCount,
    resetBreathing,
    finishBreathing,
  ]);

  //Reset text finished each time to eneter
  useEffect(() => {
    contextTheme?.setFinished(false);
  }, [contextTheme]);

  useEffect(() => {
    const scaleTo = isInhale ? 1.5 : 0.8; // Scale factor for inhale and exhale
    if (contextTheme?.isRunning) {
      Animated.timing(scaleValue, {
        toValue: scaleTo,
        duration: 4000,
        useNativeDriver: false,
      }).start();
    }
  }, [isInhale, breathDuration, scaleValue, contextTheme?.isRunning]);

  const AnimatedImageBackgroundStyled = Animated.createAnimatedComponent(
    ImageBackgroundStyled,
  );

  const toggleBreathing = () => {
    contextTheme?.setIsRunning(!contextTheme?.isRunning);
  };

  const BreatText = () => {
    if (!contextTheme?.isRunning && !contextTheme?.finished) {
      return (
        <ControlButton onPress={toggleBreathing}>
          <TextRegularStyle>Relieves stress</TextRegularStyle>
          <TextRegularStyle>by slowing </TextRegularStyle>
          <TextRegularStyle>down breathing.</TextRegularStyle>
          <TextBoldStyle>START </TextBoldStyle>
        </ControlButton>
      );
    }
    if (!contextTheme?.isRunning && contextTheme?.finished) {
      return (
        <ControlButton onPress={toggleBreathing}>
          <TextRegularStyle>Well Done!!!</TextRegularStyle>
          <TextRegularStyle>How Do you feel?</TextRegularStyle>
          <TextRegularStyle>Try again?</TextRegularStyle>
        </ControlButton>
      );
    }
    return (
      <>
        <TextRegularStyle>Cycle {cycleCount + 1} of 5</TextRegularStyle>
        <TextBoldStyle>{breathPhase}</TextBoldStyle>
        <TextRegularStyle>{timer}s</TextRegularStyle>
      </>
    );
  };
  return (
    <BreathView>
      <AnimatedImageBackgroundStyled
        resizeMode="contain"
        style={{
          transform: [{scale: scaleValue}],
        }}
        source={require(`../../../assets/images/bg-breath.png`)}>
        <BreatText />
      </AnimatedImageBackgroundStyled>
    </BreathView>
  );
}

const BreathView = styled(View)`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 60%;
  z-index: 10;
  bottom: 0%;
`;

const ImageBackgroundStyled = styled(ImageBackground)`
  display: flex;
  min-width: 100%;
  text-align: center;
  justify-content: center;
  align-content: center;
  align-items: center;
`;
const TextRegularStyle = styled(Text)`
  color: white;
  font-weight: 200;
  font-size: 15px;
  text-align: center;
`;
const TextBoldStyle = styled(Text)`
  color: white;
  font-weight: 700;
  font-size: 22px;
  text-transform: uppercase;
  text-align: center;
`;

const ControlButton = styled(TouchableOpacity)`
  text-align: center;
  display: flex;
  justify-content: center;
`;
