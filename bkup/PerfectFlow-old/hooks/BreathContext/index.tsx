import {createContext} from 'react';

export type BreathStateType = {
  seticonPlusState: React.Dispatch<React.SetStateAction<any>>;
  iconPlusState: any;
  setDialogOpened: React.Dispatch<React.SetStateAction<any>>;
  DialogOpened: any;
  setTabButton: React.Dispatch<React.SetStateAction<any>>;
  TabButton: any;
  setSelectedSounds: React.Dispatch<React.SetStateAction<any>>;
  SelectedSounds: any;
  soundInstances: any;
  setSoundInstances: React.Dispatch<React.SetStateAction<any>>;
};

const BreathContext = createContext<BreathStateType | undefined>(undefined);
export default BreathContext;
