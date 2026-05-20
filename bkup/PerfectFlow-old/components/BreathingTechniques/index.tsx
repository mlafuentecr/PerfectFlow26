import React, {useContext} from 'react';
import {ScrollView, View} from 'react-native';
import breathingTechniquesData from './data';
import ThemeContext, {AppStateType} from '../../hooks/ThemeContext';
import {
  TechniqueButtonWrapper,
  TechniqueButton,
  TechniqueTitle,
  DescriptionContainer,
  DescriptionText,
} from './styles';
import HTML from 'react-native-render-html';
import {COLORS, SubTitleStyled} from '../GlobalStyles';
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

const BreathingTechniques = () => {
  const contextTheme = useContext<AppStateType | undefined>(ThemeContext);
  const benefitsInfo = contextTheme?.data?.benefits || null;
  const toggleDescription = (index: number) => {
    contextTheme?.setSelectedTechnique(breathingTechniquesData[index].title);
  };
  const contentWidth = contextTheme?.width ?? undefined;
  const Description = ({data, index}: {data: any; index: number}) => {
    const isActive = contextTheme?.selectedTechnique === data.title;
    return (
      <>
        <TechniqueButton
          onPress={() => toggleDescription(index)}
          active={isActive}>
          <TechniqueTitle active={isActive}>{data.title}</TechniqueTitle>
        </TechniqueButton>

        <DescriptionContainer active={isActive}>
          <DescriptionText>{data.description}</DescriptionText>
        </DescriptionContainer>
      </>
    );
  };

  return (
    <ScrollView>
      <TechniqueButtonWrapper>
        {breathingTechniquesData.map((data, index) => (
          <Description key={index} index={index} data={data} />
        ))}
        <View style={{marginTop: 24}}>
          {benefitsInfo?.description ? (
            <SubTitleStyled>{benefitsInfo?.title}</SubTitleStyled>
          ) : null}
          <HTML
            baseStyle={htmlStyle}
            contentWidth={contentWidth}
            source={{
              html: benefitsInfo?.description || fallBackDescription,
            }}
          />
        </View>
      </TechniqueButtonWrapper>
    </ScrollView>
  );
};
const htmlStyle = {
  fontSize: 18,
  color: COLORS.white,
};
export default BreathingTechniques;
