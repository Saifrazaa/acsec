import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styled from 'styled-components';
import {color, fonts, mobileScreen, sizes} from '../helper';
const NavBox = ({heading, description, image, onClick, disabled}) => {
  return (
    <>
      <NavBg onPress={onClick} disabled={disabled}>
        <ImageWrapper>
          <NavImg source={image} alt="image" />
        </ImageWrapper>
        <TextWrapper>
          <NavText>{heading}</NavText>
          <NavDesc>{description}</NavDesc>
        </TextWrapper>
      </NavBg>
    </>
  );
};

const NavImg = styled.Image`
  margin: 0 auto;
`;
const TextWrapper = styled.View`
  width: ${wp('78%')}px;
`;
const NavText = styled.Text`
  color: ${color.primary};
  font-size: ${mobileScreen ? `${sizes.font16}` : `${sizes.font13}`};
  font-family: ${fonts.AxiformaBold};
`;
const ImageWrapper = styled.View`
  width: ${wp('18%')}px;
`;
const NavDesc = styled.Text`
  color: ${color.black};
  font-size: ${mobileScreen ? `${sizes.font14}` : `${sizes.font12}`};
  font-family: ${fonts.AxiformaLight};
  margin-top: 5px;
`;
const NavBg = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${color.lightest_grey};
  border: 1px solid ${color.border_grey};
  border-radius: 10px;
  padding: ${mobileScreen
    ? `${wp('5%')}px ${wp('5%')}px`
    : `${wp('3%')}px ${wp('3%')}px`};
  padding-left: 0;
  margin-top: ${hp('2%')}px;
`;

export default NavBox;
