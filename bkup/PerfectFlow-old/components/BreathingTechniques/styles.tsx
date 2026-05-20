import {View, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../GlobalStyles';

const TechniqueButtonWrapper = styled(View)`
  background-color: ${COLORS.bgAccent2};
  border-radius: 5px;
  width: 100%;
  display: flex;
  padding: 30px 15px;
`;

const TechniqueButton = styled(TouchableOpacity)<{active: boolean}>`
  background-color: ${({active}) => (active ? COLORS.bgAccent : '#f3f3f3')};
  padding-bottom: 5px;
  padding-top: 5px;
  border-radius: ${({active}) => (active ? '5px 5px 0px 0px' : '5px')};
  overflow: hidden;
  height: ${({active}) => (active ? 'initial' : '50px')};
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  border: 2px solid ${({active}) => (active ? COLORS.bgAccent : 'transparent')};
  width: 100%;
  margin: auto;
  margin-bottom: ${({active}) => (active ? '0px' : '10px')};
`;

const TechniqueTitle = styled(Text)<{active: boolean}>`
  font-size: 16px;
  font-weight: bold;
  color: ${COLORS.accent2};
  padding: 5px;
  padding-left: 10px;
`;

const DescriptionContainer = styled(View)<{active: boolean}>`
  margin-bottom: 10px;
  padding: 10px;
  display: ${({active}) => (active ? 'flex' : 'none')};
  background-color: #e0e0e0;
  border: 2px solid ${({active}) => (active ? COLORS.bgAccent : 'transparent')};
  border-radius: ${({active}) => (active ? '0px 0px 5px 5px' : '5px')};
  width: 100%;
`;

const DescriptionText = styled(Text)`
  margin-top: 5px;
  font-size: 16px;
  color: black;
  display: flex;
`;
export {
  TechniqueButtonWrapper,
  TechniqueButton,
  TechniqueTitle,
  DescriptionContainer,
  DescriptionText,
};
