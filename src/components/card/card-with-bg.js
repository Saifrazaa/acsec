import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {color, fonts, sizes} from '../../shared-components/helper';

const CardWithBg = ({width, bgImg, btnText, logo, onPress}) => {
    return (
        <Wrapper width={width} source={bgImg && {uri: bgImg}}>
            <DarkGradient
                source={require('../../assets/images/dark-gradient.png')}
            />
            <InnerWrapper withLogo={logo}>
                {logo && <Logo source={logo} />}
                <CardButton onPress={onPress}>
                    <BtnText>{btnText}</BtnText>
                </CardButton>
            </InnerWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.ImageBackground`
    width: ${props => (props.width ? props.width + 'px' : '40%')};
    height: ${hp('22%')}px;
    margin-right: ${wp('3%')}px;
    border-top-left-radius: ${wp('3%')}px;
    border-bottom-left-radius: ${wp('3%')}px;
    border-top-right-radius: ${wp('3%')}px;
    border-bottom-right-radius: ${wp('3%')}px;
    overflow: hidden;
    flex-direction: column;
`;

const DarkGradient = styled.Image`
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 0;
`;

const CardButton = styled.TouchableOpacity`
    width: 100%;
    background-color: ${color.white}4D;
    border-radius: ${wp('3%')}px;
    padding: ${wp('3%')}px 0;
`;

const BtnText = styled.Text`
    color: ${color.white};
    font-size: ${sizes.font18};
    text-align: center;
    font-family: ${fonts.GilroyBold};
`;

const InnerWrapper = styled.View`
    padding: ${wp('4%')}px;
    flex: 1 0;
    justify-content: ${props =>
        props.withLogo ? 'space-between' : 'flex-end'};
`;

const Logo = styled.Image`
    margin-top: ${wp('2%')}px;
    margin-left: ${wp('2%')}px;
    width: ${wp('18%')}px;
    resize-mode: contain;
`;

export default CardWithBg;
