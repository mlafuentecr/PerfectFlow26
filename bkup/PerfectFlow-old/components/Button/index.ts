import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

interface ButtonStyledProps {
  color: string;
}

interface ColorProps {
  backgroundColor: string;
  borderColor: string;
}

const colorChoose = (color: string): ColorProps => {
  switch (color) {
    case 'green':
      return {backgroundColor: '#8cc03f', borderColor: '#8cc03f'};

    case 'transparent':
      return {backgroundColor: '#38364f85', borderColor: '#8cc03f'};

    case 'yellow':
      return {backgroundColor: '#f5e942', borderColor: '#f5e942'};

    default:
      return {backgroundColor: '#8cc03f', borderColor: '#8cc03f'};
  }
};

const ButtonStyled = styled(TouchableOpacity)<ButtonStyledProps>`
  border-radius: 48px;
  text-align: center;
  display: flex;
  min-width: 100%;
  justify-content: center;
  align-items: center;
  padding: 0px;
  margin: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 10px 10px 10px;
  margin: 10px auto;
  border-width: 1px;
  /* Use colorChoose function to set styles based on the 'color' prop */
  background-color: ${({color}) => colorChoose(color).backgroundColor};
  border-color: ${({color}) => colorChoose(color).borderColor};
`;
export {ButtonStyled};
