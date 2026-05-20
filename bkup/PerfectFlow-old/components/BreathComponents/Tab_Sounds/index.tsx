import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import IconComponent from '../../IconComponent';
import SoundSelected from '../../SoundSelectedIcons';
import Imgs_and_snd from '../../Data/Array_images_sounds';

export default function Sounds() {
  const IconList = () => {
    return Object.keys(Imgs_and_snd).map((name: string, index: number) => (
      <IconComponent key={index} name={name} />
    ));
  };

  return (
    <ScrollView>
      <ViewStyled>
        <ViewSndSlectedStyled>
          <SoundSelected />
        </ViewSndSlectedStyled>
        <ViewIconsStyled>{IconList()}</ViewIconsStyled>
      </ViewStyled>
    </ScrollView>
  );
}

const ViewStyled = styled.View`
  flex: 1;
  padding: 10px;
`;

const ViewIconsStyled = styled.View`
  flex: 1;
  flex-direction: row;
  padding: 10px;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-around;
`;
const ViewSndSlectedStyled = styled.View`
  flex: 1;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-around;
  border: 1px solid #f3f3f36c;
  border-radius: 5px;
`;
