import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View, Platform} from 'react-native';
import PageInternal from '../components/PageInternal';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import {
  TitleLargeStyled,
  Container,
  SubTitleStyled,
  COLORS,
} from '../components/GlobalStyles';
import {ButtonClose} from '../components/ButtonClose';
import {Section} from '../components/Section';
import styled from 'styled-components/native';
import {Linking} from 'react-native';

interface NavigationProps {
  navigation: any;
  route: any;
}

const Star = ({filled}: any) => (
  <ImageStyle
    resizeMode="cover"
    source={
      filled
        ? require('../assets/images/icon-start-fill.png')
        : require('../assets/images/icon-start-nofill.png')
    }
  />
);

const RateUs = ({route}: NavigationProps) => {
  const [rating, setRating] = useState(0);
  const [Answer, setAnswer] = useState('');
  const minimalScore = 4;
  const handleEmail = () => {
    Linking.openURL('mailto:info@perfectend.com');
  };

  // Load the stored rating on component mount
  useEffect(() => {
    loadStoredRating();
  }, []);

  const loadStoredRating = async () => {
    try {
      const storedRating = await AsyncStorage.getItem('userRating');
      if (storedRating) {
        setRating(parseInt(storedRating, 10));
      }
    } catch (error) {
      console.error('Error loading stored rating:', error);
    }
  };

  useEffect(() => {
    if (rating <= minimalScore && rating > 0) {
      setAnswer("Sorry to hear that! We'd love to improve.");
    }
    if (rating >= minimalScore) {
      setAnswer('Thanks');
      // Open Google Play Store link for Android
      if (Platform.OS === 'android') {
        Linking.openURL(
          'https://play.google.com/store/apps/details?id=your.app.package',
        );
      }
      // Open App Store link for iOS
      if (Platform.OS === 'ios') {
        Linking.openURL('https://apps.apple.com/app/your-app-name/idyourappid');
      }
    }
    AsyncStorage.setItem('userRating', rating.toString());
  }, [rating]);

  return (
    <PageInternal route={route}>
      <Container>
        <ButtonClose />
        <TitleLargeStyled>Rate Us</TitleLargeStyled>
        <View style={{marginTop: 40}}>
          <SubTitleStyled>Enjoying our app?</SubTitleStyled>
          <Section alignText="left">
            Your positive feedback fuels our motivation to continuously enhance
            your experience. Share your thoughts and rate us on the store.{' '}
            {'\n'}
            {'\n'}Your feedback powers the positive changes that make our app
            even better for you. Thank you for being a part of our journey!
          </Section>
          <CardStyle>
            {[1, 2, 3, 4, 5].map(id => (
              <TouchableStyled key={id} onPress={() => setRating(id)}>
                <Star filled={rating >= id} />
              </TouchableStyled>
            ))}
          </CardStyle>

          <View style={{marginTop: 40}}>
            <Section alignText="center">
              <Text>{Answer}</Text>
            </Section>
            <View
              style={{
                display: rating < minimalScore ? 'flex' : 'none',
              }}>
              <ButtonStyled
                onPress={() => {
                  handleEmail();
                }}>
                <Section alignText="center">
                  Please let us know how to improve
                </Section>
              </ButtonStyled>
            </View>
          </View>
        </View>
      </Container>
    </PageInternal>
  );
};

const TouchableStyled = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
`;

const ImageStyle = styled(Image)``;

const CardStyle = styled(View)`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  padding: 10px;
  background-color: ${COLORS.transparent};
  border-radius: 10px;
  position: relative;
  margin-top: 20px;
  z-index: 10;
`;
const ButtonStyled = styled(TouchableOpacity)`
  border-radius: 48px;
  text-align: center;
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
  border-color: ${COLORS.green};
  background-color: ${COLORS.green};
  z-index: 99;
`;
export default RateUs;
