import React from 'react';
import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Platform} from 'react-native';

const GradientHeader = ({
    children,
    noBorder,
    imgSrc,
    noMarginBottom,
    noOverlay,
    noSkew,
}) => {
    return (
        <Wrapper
            noSkew={noSkew}
            noBorder={noBorder}
            noMarginBottom={noMarginBottom}
            source={
                imgSrc ? imgSrc : require('../../assets/images/gradient2.png')
            }>
            {imgSrc !== undefined && !noOverlay && imgSrc ? (
                <DarkGradient
                    noSkew={noSkew}
                    source={require('../../assets/images/dark-gradient.png')}>
                    <InnerGradient>{children}</InnerGradient>
                </DarkGradient>
            ) : (
                <InnerWrapper noSkew={noSkew}>{children}</InnerWrapper>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.ImageBackground`
    width: 100%;
    ${props => {
        if (!props.noBorder) {
            return `
                border-bottom-left-radius: ${wp('8%')}px;
                border-bottom-right-radius: ${wp('8%')}px;`;
        }
    }}
    overflow: hidden;
    ${Platform.OS === 'ios' &&
    `transform: skewY(5deg); margin-top: -15px; margin-bottom: 15px`};
    ${props =>
        props.noMarginBottom && Platform.OS === 'ios' && 'margin-bottom: 0px'}
    ${props => {
        if (props.noSkew && Platform.OS === 'ios') {
            return `
                transform:skewY(0deg);
            `;
        }
    }}
`;

const DarkGradient = styled.ImageBackground`
    width: 100%;
    overflow: hidden;
    ${Platform.OS === 'ios' &&
    `transform: skewY(-5deg); margin-bottom: -15px;`};
    ${props => {
        if (props.noSkew && Platform.OS === 'ios') {
            return `
                transform:skewY(0deg)
            `;
        }
    }}
`;

const InnerGradient = styled.View`
    padding: 0 ${wp('7%')}px ${wp('5%')}px;
`;

const InnerWrapper = styled.View`
    ${Platform.OS === 'ios' && `transform: skewY(-5deg)`};
    margin: ${props =>
        props.noInnerMargin ? '0' : `0 ${wp('7%')}px ${wp('5%')}px`};
    ${props => {
        if (props.noSkew && Platform.OS === 'ios') {
            return `
                transform:skewY(0deg)
            `;
        }
    }}
`;

export default GradientHeader;
