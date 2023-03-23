import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  color,
  fonts,
  mobileScreen,
  sizes,
} from '../../shared-components/helper';
import Layout from '../../components/layout';
import styled from 'styled-components';
import FormButton from '../../shared-components/button/form-button';
import {MinHeight} from '../../shared-components/grid-helper';

const Common = ({
  heading,
  btnText,
  btnLink,
  bannerImg,
  centerImg,
  description,
}) => {
  return (
    <Layout noPadding>
      <BannerBg source={bannerImg} resizeMode="stretch">
        <BannerImage resizeMode="contain" source={centerImg} alt="image" />
      </BannerBg>
      <Layout boxlayout>
        <MinHeight>
          <HeadingText>{heading}</HeadingText>
          <TextInfo>{description}</TextInfo>
        </MinHeight>
        <ButtonWrapper>
          <FormButton btnText={btnText} onClick={btnLink} />
        </ButtonWrapper>
      </Layout>
    </Layout>
  );
};

const BannerImage = styled.Image`
  width: ${wp('65%')}px;
  position: absolute;
  bottom: ${mobileScreen ? '-8%' : '15%'};
`;
const BannerBg = styled.ImageBackground`
  height: ${hp('55%')}px;
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;
const HeadingText = styled.Text`
  color: ${color.black};
  font-family: ${fonts.AxiformaSemiBold};
  margin-bottom: ${wp('4%')}px;
  font-size: ${mobileScreen ? `${sizes.font24}` : `${sizes.font16}`};
  text-align: center;
  margin-top: ${hp('2%')}px;
  line-height: ${hp('5.5%')}px;
`;
const ButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${hp('3%')}px;
`;

const TextInfo = styled.Text`
  text-align: center;
  font-size: ${mobileScreen ? `${sizes.font14}` : `${sizes.font13}`};
  color: ${color.gray};
`;
export default Common;
