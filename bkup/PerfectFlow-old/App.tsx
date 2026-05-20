import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainStack from './navigation/MainStack';
import ThemeContext from './hooks/ThemeContext';
import FetchData from './components/FetchData';
import PageInternal from './components/PageInternal';
import {Container, TitleInternStyled} from './components/GlobalStyles';
import {AppStateType} from './hooks/ThemeContext';
import {useWindowDimensions} from 'react-native';

const App = () => {
  // Fetch data
  const {data, loading} = FetchData();
  // Background
  const [blurState, setBlurState] = useState(5);
  //BREATH APP START
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState('Box Breathing');
  const {width} = useWindowDimensions();
  const TechniqueArr = [
    'Diaphragmatic Breathing',
    '4-7-8 Breathing',
    'Box Breathing',
    'Alternate Nostril Breathing',
  ];

  // Set menu state
  const [menuChoose, setmenuChoose] = useState('');
  const menuState: AppStateType = {
    menuChoose,
    setmenuChoose,
    data,
    blurState,
    setBlurState,
    isRunning,
    setIsRunning,
    backgroundImage,
    setBackgroundImage,
    selectedTechnique,
    setSelectedTechnique,
    finished,
    setFinished,
    TechniqueArr,
    width,
  };

  if (loading) {
    return (
      <PageInternal route={''}>
        <Container>
          <TitleInternStyled>LOADING</TitleInternStyled>
        </Container>
      </PageInternal>
    );
  }

  return (
    <ThemeContext.Provider value={menuState}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </ThemeContext.Provider>
  );
};

export default App;
