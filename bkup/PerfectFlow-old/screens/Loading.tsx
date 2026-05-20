import React from 'react';
import {View} from 'react-native';
import PageInternal from '../components/PageInternal';
import {TitleLargeStyled} from '../components/GlobalStyles';
import {ButtonClose} from '../components/ButtonClose';
import styled from 'styled-components/native';
import FooterBreath from '../components/FooterBreath';
// import BreathImg from '../components/BreathComponents/BreathImg';
// import BtnAdd from '../components/BreathComponents/BtnAdd';
import {DialogBox} from '../components/BreathComponents/DialogBox';
import {ButtonStyled} from '../components/Button';
import {Section} from '../components/Section';
interface NavigationProps {
  navigation: any;
  route: any;
}

const Loading = ({navigation, route}: NavigationProps) => {
  return (
    <PageInternal route={route}>
      <ButtonClose />
      <TitleLargeStyled>Loading</TitleLargeStyled>
      <BreathView>
        <ButtonStyled
          color="green"
          onPress={() => navigation.navigate('Settings')}>
          <Section alignText="center">Start your experience</Section>
        </ButtonStyled>
      </BreathView>
      <DialogBox />
      <FooterBreath />
    </PageInternal>
  );
};
const BreathView = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;
export default Loading;
