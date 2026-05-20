import {useEffect, useContext} from 'react';
import {TQTextRegularStyle, TQTouchableOpacity} from '../../GlobalStyles';
import ThemeContext, {AppStateType} from '../../../hooks/ThemeContext';

const TechniqueFinished = () => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      contextTheme?.setFinished(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [contextTheme]);

  return (
    <TQTouchableOpacity>
      <TQTextRegularStyle>How do you {'\n'} feel?</TQTextRegularStyle>
    </TQTouchableOpacity>
  );
};

export {TechniqueFinished};
