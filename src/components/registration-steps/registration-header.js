import React from 'react';
import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-fontawesome-pro';
import {Platform, StatusBar} from 'react-native';

import {color, sizes, fonts, Iconsizes} from '../../shared-components/helper';
import GradientHeader from '../../shared-components/gradient-elements/gradient-header';

const RegisterHeader = ({activeStep}) => {
    const stepperHeadings = [
        'Personal Information',
        'Contact Information',
        'Other Information',
    ];

    return (
        <>
            <GradientHeader noBorder gradient2 noSkew>
                <HeaderWrap>
                    <PreHeading>Register with</PreHeading>
                    <LogoImg
                        source={require('../../assets/images/talentibex-logo.png')}
                    />
                    <Stepper>
                        {stepperHeadings &&
                            stepperHeadings.length > 0 &&
                            stepperHeadings.map((item, index) => {
                                return (
                                    <StepperDot
                                        key={index}
                                        active={
                                            activeStep === index ? true : false
                                        }>
                                        {index <= activeStep && (
                                            <Icon
                                                name="check"
                                                size={Iconsizes.size10}
                                                color={color.white}
                                            />
                                        )}
                                    </StepperDot>
                                );
                            })}
                    </Stepper>
                    <StepperHeadings>
                        {stepperHeadings &&
                            stepperHeadings.length > 0 &&
                            stepperHeadings.map((heading, index) => {
                                return (
                                    <Animatable.View
                                        easing="ease-out"
                                        transition="opacity"
                                        duration={300}
                                        key={index}
                                        style={{
                                            opacity:
                                                index === activeStep ? 1 : 0,
                                            position: 'absolute',
                                            left: wp('0%'),
                                            top: wp('3%'),
                                        }}>
                                        <StepperHeading key={index}>
                                            {heading}
                                        </StepperHeading>
                                    </Animatable.View>
                                );
                            })}
                    </StepperHeadings>
                </HeaderWrap>
            </GradientHeader>
        </>
    );
};

const HeaderWrap = styled.SafeAreaView`
    flex: 1 0;
    min-height: ${hp('40%')}px;
    ${Platform.OS === 'android' && `padding-top: ${StatusBar.currentHeight}px`};
    margin-bottom: ${hp('4%')}px;
    justify-content: center;
`;

const Stepper = styled.View`
    flex-direction: row;
    margin-top: ${wp('15%')}px;
    justify-content: space-between;
    width: ${wp('15%')}px;
`;
const StepperDot = styled.View`
    background-color: ${props =>
        props.active ? `${color.white}` : `${color.white}33`};
    width: ${wp('3.3%')}px;
    height: ${wp('3.3%')}px;
    border-radius: ${wp('5%')}px;
    align-items: center;
    justify-content: center;
`;

const StepperHeadings = styled.View`
    position: relative;
`;

const StepperHeading = styled.Text`
    font-size: ${sizes.font16};
    color: ${color.white};
    font-family: ${fonts.GilroyMedium};
`;

const LogoImg = styled.Image`
    width: ${wp('60%')}px;
    height: ${wp('12%')}px;
    resize-mode: contain;
    margin-top: ${wp('1%')}px;
`;

const PreHeading = styled.Text`
    font-size: ${sizes.font16};
    color: ${color.white};
    font-family: ${fonts.GilroyMedium};
`;

export default RegisterHeader;
