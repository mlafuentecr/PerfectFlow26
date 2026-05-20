import React, {useContext} from 'react';
import ThemeContext, {AppStateType} from '../../../hooks/ThemeContext';
import BreathContext, {BreathStateType} from '../../../hooks/BreathContext';
import {
  TQTextRegularStyle,
  TQTouchableOpacity,
  TQTextSmallerStyle,
  TQ_ImgInfo,
} from '../../GlobalStyles';

import {useBreathingTimes} from '../../../hooks/useBreathingTimes';
import {ImageRefresh} from '../../ImageRefresh';

const TechniqueRandomChange = () => {
  const breathContext = useContext<BreathStateType | undefined>(BreathContext);
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const Timers = useBreathingTimes();
  const ImageInfo = require('../../../assets/images/info.png');
  //
  const changeTechnique = () => {
    const randomIndex = Math.floor(
      Math.random() * (contextTheme?.TechniqueArr?.length || 0),
    );
    contextTheme?.setSelectedTechnique(contextTheme?.TechniqueArr[randomIndex]);
  };

  const handleInfoClcick = () => {
    //Stop Breath
    contextTheme?.setIsRunning(false);
    breathContext?.setDialogOpened(!breathContext?.DialogOpened);
  };

  return (
    <>
      <TQTouchableOpacity onPress={() => handleInfoClcick()}>
        <TQ_ImgInfo source={ImageInfo} />
      </TQTouchableOpacity>
      <TQTextRegularStyle>{contextTheme?.selectedTechnique}</TQTextRegularStyle>
      <TQTextSmallerStyle>{Timers.timesString}</TQTextSmallerStyle>
      <TQTextSmallerStyle> press START btn</TQTextSmallerStyle>
      <TQTouchableOpacity onPress={() => changeTechnique()}>
        <ImageRefresh />
      </TQTouchableOpacity>
    </>
  );
};

export {TechniqueRandomChange};
