import React from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {color, fonts, sizes} from '../../shared-components/helper';

const AvatarInitials = ({name, fontSize}) => {
  const getAvatarInitials = data => {
    let initial = data
      ?.split(' ')
      .map(n => n[0])
      .join('');
    return initial;
  };

  return (
    <AvatarInitial>
      <GradientView source={require('../../assets/images/gradient2.png')}>
        <Initial fontSize={fontSize}>{getAvatarInitials(name)}</Initial>
      </GradientView>
    </AvatarInitial>
  );
};

const AvatarInitial = styled.View`
  border-radius: ${wp('50%')}px;
  overflow: hidden;
`;

const GradientView = styled.ImageBackground`
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const Initial = styled.Text`
  font-size: ${props => (props.fontSize ? props.fontSize : sizes.font38)};
  font-family: ${fonts.GilroyBold};
  color: ${color.white};
`;

export default AvatarInitials;
