import {View} from 'react-native';
import {TouchableOpacity, Image, Text} from 'react-native';
import styled from 'styled-components/native';

const Button = styled(TouchableOpacity)`
  position: relative;
  display: flex;
  width: 40px;
  height: 40px;
  padding: 0px;
  margin: 0px;
  border: 1px solid #aeaeae7b;
  margin-right: 5px;
  margin-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  background-color: '#0f316a3e';
`;

const ImageStyled = styled(Image)`
  display: flex;
  width: 100%;
  height: 100%;
`;

const TextStyled = styled(Text)`
  color: white;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  text-align: center;
  padding: 0px;
  margin: 0px;
  top: -8px;
  right: -8px;
  background-color: #2d2d2d;
  width: 20px;
  height: 20px;
  border-radius: 150px;
  font-size: 10px;
  line-height: 20px;
  border: 1px solid #2c2f3ec3;
`;

const ViewStyled = styled(View)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  border: 1px solid #2e2b5a;
  background-color: #16153e;
`;

export {TextStyled, ImageStyled, Button, ViewStyled};
