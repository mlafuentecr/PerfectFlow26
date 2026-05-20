import {Image} from 'react-native';
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import styled from 'styled-components/native';

// Define a union type for the specific values of styleText prop
type TextAlignment = 'center' | 'left' | 'right';

// Interface for DescriptionStyled component props
interface DescriptionStyledProps {
  alignText?: TextAlignment;
}
const COLORS = {
  green: '#8CC03F',
  white: '#ffffff',
  accent: '#8CC03F',
  textAccent: '#dfe215',
  bgAccent: '#8CC03F',
  accent2: '#182357',
  bgAccent2: '#182357',
  bgAccent3: '#091031',
  transparent: '#38364fd0',
  transparent2: '#1d193be0',
};
const GLOBAL = {
  padding: 24,
};
// GLOBALS
const Container = styled(View)`
  flex: 1;
  position: relative;
  z-index: 10;
  min-height: 100%;
  padding: 10px 20px;
`;
const DialogSubTitle = styled(View)`
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  align-content: center;
  height: 50px;
  padding: 0px;
  margin: 0px;
  border: 1px solid #aeaeae7b;
  background-color: #0f316a3e;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 5px;
  margin-right: 5px;
  padding-left: 15px;
  padding-right: 15px;
  flex-direction: row;
  z-index: 99;
  width: 100%;
`;
const TitleStyled = styled(Text)<DescriptionStyledProps>`
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: flex;
  text-align: ${props => (props.alignText ? 'center' : 'left')};
`;
const TitleInternStyled = styled(Text)`
  font-size: 32px;
  font-weight: bold;
  color: white;
  display: flex;
  margin-top: 10px;
`;

const SubTitleStyled = styled(Text)`
  font-size: 20px;
  color: white;
  display: flex;
  width: 100%;
  margin-top: 10px;
`;

const TitleLargeStyled = styled(Text)<DescriptionStyledProps>`
  font-size: 42px;
  font-weight: bold;
  color: white;
  display: flex;
  text-align: ${props => (props.alignText ? 'center' : 'left')};
`;
const DescriptionStyled = styled(Text)<DescriptionStyledProps>`
  font-size: 16px;
  font-weight: 400;
  color: white;
  text-align: ${props => (props.alignText ? props.alignText : 'left')};
  z-index: 1;
  overflow: hidden;
`;
const WhiteTextStyled = styled(Text)<DescriptionStyledProps>`
  font-size: 14px;
  font-weight: 300;
  color: white;
  z-index: 1;
  overflow: hidden;
`;
//${COLORS.green}
const LinkStyle = styled(Text)`
  font-size: 16px;
  color: yellow;
  text-decoration: solid;
  width: 100%;
`;
const CardTitleStyled = styled(Text)`
  font-size: 18px;
  color: white;
  display: flex;
  min-width: 100%;
  margin: 5px 0px;
`;
const CardStyle = styled(View)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #ffffff79;
  background-color: ${COLORS.transparent};
  border-radius: 10px;
  position: relative;
  margin-top: 20px;
  z-index: 10;
`;
const SafeArea = styled(SafeAreaView)`
  display: flex;
  flex: 1;
`;
//TECHNIQUE TQ
interface BreathPhaseText {
  BreathPhase: string;
}

const TQ_View = styled(View)`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 60%;
  z-index: 10;
  bottom: 0%;
`;

const TQ_BackgroundStyled = styled(ImageBackground)`
  display: flex;
  min-width: 100%;
  height: 100%;
  text-align: center;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

const TQTextRegularStyle = styled(Text)`
  color: white;
  font-weight: 600;
  font-size: 18px;
  text-align: center;
`;
const TQTextSmallerStyle = styled(Text)`
  color: white;
  font-weight: 300;
  font-size: 13px;
  text-align: center;
  line-height: 20px;
`;

const TQTextBoldStyle = styled(Text)<BreathPhaseText>`
  color: ${props =>
    props.BreathPhase === 'Breath'
      ? 'white'
      : props.BreathPhase === 'Hold'
      ? '#eb7161'
      : props.BreathPhase === null
      ? '#f9f9f9'
      : '#1c78bb'};

  font-weight: 700;
  font-size: 22px;
  text-transform: uppercase;
  text-align: center;
`;

const TQTouchableOpacity = styled(TouchableOpacity)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 220px;
`;

const TQ_View_animate = styled(View)<{imageNumber: string}>`
  text-align: center;
  display: flex;
  justify-content: center;
  margin: auto;
  transform: scale(${props => props.imageNumber});
  transition: all 0.5s;
`;
const TQ_ImgInfo = styled(Image)`
  display: flex;
  justify-content: center;
  margin: auto;
  width: 30px;
  height: 30px;
  margin: 5px;
`;

export {
  COLORS,
  SafeArea,
  Container,
  TitleStyled,
  DescriptionStyled,
  TitleLargeStyled,
  TitleInternStyled,
  SubTitleStyled,
  LinkStyle,
  CardStyle,
  WhiteTextStyled,
  CardTitleStyled,
  GLOBAL,
  DialogSubTitle,
  TQ_View,
  TQ_BackgroundStyled,
  TQTextRegularStyle,
  TQTextBoldStyle,
  TQTouchableOpacity,
  TQ_View_animate,
  TQTextSmallerStyle,
  TQ_ImgInfo,
};
