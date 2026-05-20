import React from 'react';
import {ScrollView, Text} from 'react-native';
import styled from 'styled-components/native';
import SoundSelected from '../../SoundSelectedIcons';
import useMessage from '../../../hooks/useMessage';

export default function Volumen() {
  const Message = useMessage();
  return (
    <ScrollView>
      <ViewSndSlectedStyled>
        <SoundSelected />
        <TextWrap>{Message}</TextWrap>
      </ViewSndSlectedStyled>
    </ScrollView>
  );
}

const ViewSndSlectedStyled = styled.View`
  flex: 1;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-around;
  border: 1px solid #f3f3f36c;
  border-radius: 5px;
`;
const TextWrap = styled(Text)`
  color: white;
  width: 100%;
  display: flex;
  text-align: center;
  background-color: #1f202380;
  padding: 5px;
`;
