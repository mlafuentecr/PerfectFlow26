import React from 'react';
import {ButtonClose} from '../components/ButtonClose';
import PageInternal from '../components/PageInternal';
import {Container, TitleLargeStyled} from '../components/GlobalStyles';
import {
  Image,
  Text,
  TouchableOpacity,
  Linking,
  BackHandler,
} from 'react-native';
import {styled} from 'styled-components';
interface NavigationProps {
  navigation: any;
  route: any;
}

const LinkImageText = ({icon, text, onPress}: any) => {
  return (
    <LinkIconStyled onPress={onPress}>
      <Image source={icon} />
      <TextStyled>{text}</TextStyled>
    </LinkIconStyled>
  );
};
const handleEmail = () => {
  Linking.openURL('mailto:info@perfectend.com');
};
const Settings = ({navigation, route}: NavigationProps) => {
  return (
    <PageInternal route={route}>
      <Container>
        <ButtonClose />
        <TitleLargeStyled>Settings</TitleLargeStyled>
        {/* ICONS */}
        {/* <LinkImageText
          icon={require(`../assets/images/icon-scan.png`)}
          onPress={() => navigation.navigate('Benefits')}
          text={'Scan QR'}
        /> */}
        <LinkImageText
          icon={require(`../assets/images/icon-scan.png`)}
          onPress={() => navigation.navigate('Benefits')}
          text={'Benefits'}
        />
        <LinkImageText
          icon={require(`../assets/images/icon-start.png`)}
          text={'Rate Us'}
          onPress={() => navigation.navigate('RateUs')}
        />
        <LinkImageText
          icon={require(`../assets/images/icon-email.png`)}
          onPress={() => {
            handleEmail();
          }}
          text={'Contact Us'}
        />
        <LinkImageText
          icon={require(`../assets/images/icon-Help.png`)}
          onPress={() => navigation.navigate('Help')}
          text={'Help'}
        />
        <LinkImageText
          icon={require(`../assets/images/icon-Faq.png`)}
          onPress={() => navigation.navigate('Faq')}
          text={'FAQs'}
        />
        <LinkImageText
          icon={require(`../assets/images/icon-terms.png`)}
          onPress={() => navigation.navigate('TermsAndConditions')}
          text={'Terms And Conditions'}
        />
        <LinkImageText
          icon={require(`../assets/images/icon-privacy.png`)}
          onPress={() => navigation.navigate('Privacy')}
          text={'Privacy Policy'}
        />
        <LinkImageText
          icon={require(`../assets/images/icon-knoledge.png`)}
          onPress={() => navigation.navigate('Acknowledgment')}
          text={'Acknowledgments'}
        />

        <LinkImageText
          icon={require(`../assets/images/icon-SignOut.png`)}
          onPress={() => BackHandler.exitApp()}
          text={'Logout'}
        />
      </Container>
    </PageInternal>
  );
};

const LinkIconStyled = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  min-width: 100%;
  justify-content: start;
  padding: 0px;
  margin: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 10px 0px;
  margin-top: 10px;
`;
const TextStyled = styled(Text)`
  color: white;
  margin-left: 10px;
  font-size: 20px;
  text-transform: capitalize;
`;

export default Settings;
