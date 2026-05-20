import {createContext} from 'react';
export interface BreathingTechnique {
  title: string;
  description: string;
}

export type AppStateType = {
  menuChoose: string | undefined;
  setmenuChoose: React.Dispatch<React.SetStateAction<string>>;
  data: any;
  blurState: any;
  setBlurState: React.Dispatch<React.SetStateAction<any>>;
  isRunning: any;
  setIsRunning: React.Dispatch<React.SetStateAction<any>>;
  backgroundImage: any;
  setBackgroundImage: React.Dispatch<React.SetStateAction<any>>;
  selectedTechnique: any;
  setSelectedTechnique: React.Dispatch<React.SetStateAction<any>>;
  finished: any;
  setFinished: React.Dispatch<React.SetStateAction<any>>;
  TechniqueArr: Array<string>;
  width: any;
};

const ThemeContext = createContext<AppStateType | undefined>(undefined);
export default ThemeContext;
