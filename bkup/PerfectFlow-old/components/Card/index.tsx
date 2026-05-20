import React, {useContext, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {CardTitleStyled, CardStyle} from '../../components/GlobalStyles';
import HTML from 'react-native-render-html';
import ThemeContext, {AppStateType} from '../../hooks/ThemeContext';
interface CardProps {
  dataArr: {
    title: string | '';
    description: string | '';
    link_url: string | '';
  }[];
}

const Card = ({dataArr = []}: CardProps) => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const [cardStates, setCardStates] = useState<boolean[]>(
    Array(dataArr.length).fill(false),
  );

  const toggleCardState = (index: number) => {
    const newCardStates = [...cardStates];
    newCardStates[index] = !newCardStates[index];
    setCardStates(newCardStates);
  };
  const htmlStyle = {fontSize: 18, color: 'white'};
  return (
    <View>
      {dataArr.map((data, index) => (
        <CardStyle key={index}>
          <TouchableOpacity onPress={() => toggleCardState(index)}>
            <CardTitleStyled>{data.title}</CardTitleStyled>
          </TouchableOpacity>
          <View
            style={{
              overflow: 'hidden',
              paddingRight: 30,
              display: cardStates[index] ? 'flex' : 'none',
            }}>
            <HTML
              contentWidth={contextTheme?.width}
              baseStyle={htmlStyle}
              source={{html: data.description}}
            />
          </View>
        </CardStyle>
      ))}
    </View>
  );
};

export default Card;
