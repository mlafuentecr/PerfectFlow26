import {Image, View} from 'react-native';
const changeImage = require('../../assets/images/change.png');
import {styled} from 'styled-components';
const ImageRefresh = () => {
  return (
    <ChangeImageView>
      <Image source={changeImage} style={{width: 20, height: 20}} />
    </ChangeImageView>
  );
};

const ChangeImageView = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  margin: auto;
  position: relative;
  top: 20px;
`;

export {ImageRefresh};
