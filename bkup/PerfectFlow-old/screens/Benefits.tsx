import React, {useContext} from 'react';
import {Image, View, Text, ScrollView, Linking} from 'react-native';
import PageInternal from '../components/PageInternal';
import {ButtonClose} from '../components/ButtonClose';
import styled from 'styled-components/native';
import {
  TitleLargeStyled,
  SubTitleStyled,
  COLORS,
} from '../components/GlobalStyles';
import ThemeContext, {AppStateType} from '../hooks/ThemeContext';
import {Section} from '../components/Section';
import {ButtonStyled} from '../components/Button';
import HTML from 'react-native-render-html';
interface NavigationProps {
  navigation: any;
  route: any;
}
const fallBackDescription = `_Stress Reduction: Controlled breathing techniques like 4-7-8 breathing can activate the body's relaxation response, helping to reduce stress and anxiety. Slow, deliberate breathing activates the parasympathetic nervous system, which counteracts the "fight or flight" response.
Anxiety Management: Deep breathing can help manage symptoms of anxiety by promoting relaxation and reducing the body's physiological response to stressors.
Better Sleep: Practicing the 4-7-8 breathing technique before bedtime may help promote relaxation and improve sleep quality.
Blood Pressure Regulation: Controlled breathing exercises may contribute to lower blood pressure by relaxing blood vessels and reducing overall stress.
Heart Rate Variability: Deep breathing can enhance heart rate variability, a measure of the heart's adaptability to changing conditions. Higher heart rate variability is associated with better cardiovascular health.
Improved Focus and Concentration: Deep breathing exercises may improve focus and concentration by increasing oxygen supply to the brain and promoting a state of calm alertness.
Emotional Regulation: Controlled breathing techniques can help regulate emotions and improve emotional resilience.
Pain Management: Deep breathing may help manage pain by promoting relaxation and reducing muscle tension.
It's important to note that while the 4-7-8 breathing technique and other controlled breathing exercises can offer potential benefits, individual experiences may vary. Additionally, deep breathing techniques should not replace medical treatment or professional advice for specific health conditions.
Before incorporating any new breathing technique into your routine, it's a good idea to consult with a healthcare professional, especially if you have pre-existing health conditions or concerns.`;
const Benefits = ({route}: NavigationProps) => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const benefitsInfo = contextTheme?.data?.benefits || null;
  const image = benefitsInfo?.heroimage
    ? benefitsInfo.heroimage
    : '../assets/images/ad-girl.png';

  return (
    <PageInternal route={route}>
      <ScrollView>
        <ButtonClose />
        <View style={{marginLeft: 24}}>
          <TitleLargeStyled>Benefits</TitleLargeStyled>
        </View>
        {image && (
          <AdImage
            source={{
              uri: image,
            }}
            onError={() => console.log('Image failed to load.')}
          />
        )}

        <DescriptionView>
          <SubTitleStyled>{benefitsInfo?.title}</SubTitleStyled>
          <View style={{marginTop: 24}}>
            <HTML
              baseStyle={htmlStyle}
              contentWidth={contextTheme?.width}
              source={{
                html: benefitsInfo?.description || fallBackDescription,
              }}
            />
          </View>

          <ButtonStyled
            color="green"
            onPress={() =>
              Linking.openURL(
                benefitsInfo.linktitle.url || 'https://perfecten.store/',
              )
            }>
            <Section alignText="center">
              {benefitsInfo.linktitle.title || 'Start your experience'}
            </Section>
          </ButtonStyled>
          <View>
            <DescriptionStyled>
              {benefitsInfo.link_description || ' '}
            </DescriptionStyled>
          </View>
        </DescriptionView>
      </ScrollView>
    </PageInternal>
  );
};
const htmlStyle = {
  fontSize: 18,
  color: COLORS.white,
};
const AdImage = styled(Image)`
  flex: 1;
  z-index: 1;
  top: -100px;
  width: 100%;
  min-height: 478px;
`;

const DescriptionView = styled(View)`
  width: 100%;
  background-color: #151d45;
  padding: 10px 20px;
  top: -100px;
`;
const DescriptionStyled = styled(Text)`
  font-size: 16px;
  font-weight: 400;
  color: white;
  z-index: 1;
  text-align: center;
`;
export default Benefits;
