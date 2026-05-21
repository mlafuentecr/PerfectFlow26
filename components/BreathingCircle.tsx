import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function BreathingCircle({
  step,
  countdown,
  duration,
  isRunning,
  completed,
}: {
  step: string;
  countdown: number;
  duration: number;
  isRunning: boolean;
  completed?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const ringPulse = useRef(new Animated.Value(0)).current;
  const ringLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (completed) {
      scale.stopAnimation();
      scale.setValue(1);
      return;
    }
    if (!isRunning) {
      scale.stopAnimation();
      scale.setValue(1);
      return;
    }
    if (step === 'Hold') return;
    const toValue = step === 'Inhale' ? 1.25 : 0.9;
    Animated.timing(scale, { toValue, duration, useNativeDriver: true }).start();
  }, [step, duration, isRunning, scale, completed]);

  useEffect(() => {
    if (completed) {
      ringLoopRef.current?.stop();
      ringLoopRef.current = null;
      ringPulse.setValue(0);
      return;
    }
    if (!isRunning) {
      ringLoopRef.current?.stop();
      ringLoopRef.current = null;
      ringPulse.setValue(0);
      return;
    }
    if (step === 'Hold') {
      ringLoopRef.current?.stop();
      ringLoopRef.current = null;
      ringPulse.setValue(0);
      return;
    }
    ringPulse.setValue(0);
    ringLoopRef.current?.stop();
    ringLoopRef.current = Animated.loop(
      Animated.timing(ringPulse, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: true,
      })
    );
    ringLoopRef.current.start();
  }, [isRunning, step, ringPulse, completed]);

  return (
    <View style={s.wrap}>
      <Animated.View
        style={[
          s.outerRing,
          {
            transform: [
              {
                scale: ringPulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.26],
                }),
              },
            ],
            opacity: ringPulse.interpolate({
              inputRange: [0, 0.6, 1],
              outputRange: [0.65, 0.2, 0],
            }),
          },
        ]}
      >
        <View style={s.ringGlow} />
      </Animated.View>

      <Animated.View
        style={[
          s.circle,
          step === 'Hold' && !completed && s.circleHold,
          completed && s.circleDone,
          { transform: [{ scale }] },
        ]}
      >
        <LinearGradient
          colors={['rgba(196,212,255,0.36)', 'rgba(137,130,255,0.3)', 'rgba(146,216,255,0.33)']}
          start={{ x: 0.15, y: 0.05 }}
          end={{ x: 0.85, y: 1 }}
          style={s.innerGradient}
        />
        <View style={s.starNoise} />
        <View style={s.innerTextWrap}>
          {completed ? (
            <>
              <Text style={s.doneTitle}>You did it!</Text>
              <Text style={s.doneBody}>How do you feel?</Text>
            </>
          ) : (
            <>
              <Text style={s.step}>{step}</Text>
              <Text style={s.count}>{step === 'Ready' ? '--' : countdown}</Text>
            </>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
  outerRing: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    borderWidth: 2,
    borderColor: 'rgba(122,196,255,0.75)',
    shadowColor: '#64C5FF',
    shadowOpacity: 0.95,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100,128,255,0.06)',
  },
  ringGlow: {
    width: 236,
    height: 236,
    borderRadius: 118,
    borderWidth: 1,
    borderColor: 'rgba(137,192,255,0.35)',
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: 'rgba(201,243,255,0.7)',
    shadowColor: '#86E2FF',
    shadowOpacity: 0.95,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 0 },
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circleDone: {
    borderColor: 'rgba(156,255,200,0.9)',
    backgroundColor: 'rgba(53,168,111,0.35)',
    shadowColor: '#6BFFBA',
  },
  circleHold: {
    borderColor: 'rgba(210,220,236,0.7)',
    backgroundColor: 'rgba(145,155,176,0.34)',
    shadowColor: '#9DAAC2',
    shadowOpacity: 0.6,
  },
  innerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  starNoise: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  innerTextWrap: { alignItems: 'center', justifyContent: 'center' },
  step: {
    color: '#E9F3FF',
    fontSize: 25,
    fontWeight: '500',
    textShadowColor: 'rgba(20,41,112,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  count: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '700',
    marginTop: 4,
    textShadowColor: 'rgba(20,41,112,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  doneTitle: { color: '#F2FFF8', fontSize: 28, fontWeight: '800', textAlign: 'center' },
  doneBody: { color: '#E2FFF0', fontSize: 18, fontWeight: '500', marginTop: 6, textAlign: 'center' },
});
