import {Image, View} from 'react-native';
const arrowImage = require('../../../assets/images/arrow.png');
import {styled} from 'styled-components';
const ArrowDownImage = () => {
  return (
    <ArrowImageView>
      <Image source={arrowImage} style={{width: 20, height: 20}} />
    </ArrowImageView>
  );
};

const ArrowImageView = styled(View)`
  width: 30px;
  height: 30px;
  margin: auto;
  position: relative;
  bottom: -10px;
`;

export {ArrowDownImage};
