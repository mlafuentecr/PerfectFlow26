import {Text, View} from 'react-native';
import styled from 'styled-components/native';
import {DescriptionStyled} from '../GlobalStyles';

const Section = ({children, title = '', alignText = 'left'}) => {
  return (
    <View>
      {title ? <TitleStyled alignText={alignText}>aa {title}</TitleStyled> : ''}
      {children ? (
        <DescriptionStyled alignText={alignText}>{children}</DescriptionStyled>
      ) : (
        ''
      )}
    </View>
  );
};

const TitleStyled = styled(Text)`
  display: flex;
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: flex;
  padding: 0px;
  margin: 0px;
`;

export {Section};
