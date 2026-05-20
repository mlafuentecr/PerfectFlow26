import React, {useContext} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {styled} from 'styled-components';
import BreathContext, {BreathStateType} from '../../../hooks/BreathContext';
import {COLORS} from '../../GlobalStyles';
interface TabButtonProps {
  text: string;
}

const TabButton: React.FC<TabButtonProps> = ({text}) => {
  const breathContext = useContext<BreathStateType | undefined>(BreathContext);

  return (
    <DialogMenuBtnStyled
      onPress={() => breathContext?.setTabButton(text)}
      isSelected={breathContext?.TabButton === text}>
      <TextStyled isSelected={breathContext?.TabButton === text}>
        {text}
      </TextStyled>
    </DialogMenuBtnStyled>
  );
};

interface StyledButtonProps {
  isSelected: boolean | undefined;
}

const DialogMenuBtnStyled = styled(TouchableOpacity)<StyledButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  bottom: 0px;
  height: 50px;
  line-height: 50px;
  border: 1px solid #314a6bae;
  z-index: 99;
  background-color: ${props =>
    props.isSelected ? COLORS.accent : 'transparent'};
`;

const TextStyled = styled(Text)<StyledButtonProps>`
  color: ${props => (props.isSelected ? 'black' : 'white')};
  font-weight: ${props => (props.isSelected ? 800 : 300)};
  font-size: 13px;
`;

export default TabButton;
