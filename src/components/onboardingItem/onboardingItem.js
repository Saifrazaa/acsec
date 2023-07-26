import React from 'react';
import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { color, fonts, sizes } from '../../shared-components/helper';

export default OnBoadingItem = ({ item }) => {
    return (
        <Wrapper>
            <TitleWrapper>
                <Title>
                    {item.title}{' '}
                    {item.logoTextPre && <LogoTextPre>{item.logoTextPre} </LogoTextPre>}
                    {item.logoText && <LogoText>{item.logoText}</LogoText>}
                </Title>
            </TitleWrapper>
            <Para>{item.para}</Para>
        </Wrapper>
    );
};

const Wrapper = styled.View`
    width: ${wp('100%')}px;
    padding: ${wp('6%')}px ${wp('8%')}px;
`;

const TitleWrapper = styled.View``;

const Title = styled.Text`
    color: ${color.headingColor};
    font-size: ${sizes.font30};
    font-family: ${fonts.GilroyBold};
    letter-spacing: -0.5px;
    line-height: ${parseInt(sizes.font38) * 1.27}px;
    margin-bottom: 0;
`;

const LogoTextPre = styled.Text`
    font-size: ${sizes.font30};
    font-family: ${fonts.AxiformaLight};
    color: ${color.light_grey};
    margin-right: ${wp('1%')}px;
`;

const LogoText = styled.Text`
    font-size: ${sizes.font30};
    font-family: ${fonts.AxiformaBold};
    color: ${color.primary};
`;

const Para = styled.Text`
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroyMedium};
    color: ${color.black};
    line-height: ${parseInt(sizes.font16) * 1.3}px;
    margin: ${wp('5%')}px 0;
`;
