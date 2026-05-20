import useBoxBreathingLogic from '../BoxBreathingLogic';
import {TQ_View, TQ_View_animate} from '../../GlobalStyles';
import Technique_image from './Technique_image';
import {Technique_Switcher} from './Technique_Switcher';

const TechniqueSwitch = () => {
  const {scaleValue} = useBoxBreathingLogic();

  return (
    <TQ_View>
      <TQ_View_animate imageNumber={JSON.stringify(scaleValue)}>
        <Technique_image>
          <Technique_Switcher />
        </Technique_image>
      </TQ_View_animate>
    </TQ_View>
  );
};

export {TechniqueSwitch};
