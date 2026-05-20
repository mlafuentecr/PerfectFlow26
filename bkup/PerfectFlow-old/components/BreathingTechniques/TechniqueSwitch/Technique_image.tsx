import {useContext} from 'react';
import {TQ_BackgroundStyled} from '../../GlobalStyles';
import ThemeContext, {AppStateType} from '../../../hooks/ThemeContext';

const Technique_image = ({children}: any) => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);

  const bgImage = () => {
    switch (contextTheme?.selectedTechnique) {
      case 'Diaphragmatic Breathing':
        return {image: require('../../../assets/images/bg-breath2.png')};
      case '4-7-8 Breathing':
        return {image: require('../../../assets/images/bg-breath1.png')};
      case 'Box Breathing':
        return {image: require('../../../assets/images/bg-breath3.png')};
      case 'Alternate Nostril Breathing':
        return {image: require('../../../assets/images/bg-breath4.png')};
      default:
        return {image: require('../../../assets/images/bg-breath1.png')};
    }
  };
  return (
    <TQ_BackgroundStyled resizeMode="contain" source={bgImage().image}>
      {children}
    </TQ_BackgroundStyled>
  );
};

export default Technique_image;
