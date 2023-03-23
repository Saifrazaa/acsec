import React from 'react';
import {Platform} from 'react-native';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {color} from '../helper';

const SkewWrapper = ({children, bgColor, noSidePadding, noBorder}) => {
    return (
        <Wrapper
            bgColor={bgColor}
            noSidePadding={noSidePadding}
            noBorder={noBorder}>
            {Platform.OS === 'android' && <SkewView bgColor={bgColor} />}
            <InnerWrapper>{children}</InnerWrapper>
        </Wrapper>
    );
};
const Wrapper = styled.View`
    flex: 1 0;
    background-color: ${props => (props.bgColor ? props.bgColor : color.white)};
    padding: 0 ${wp('7%')}px;
    padding-top: ${wp('12%')}px;
    padding-bottom: ${wp('5%')}px;
    ${Platform.OS === 'android' && `border-top-left-radius: ${wp('9%')}px`};
    margin-top: ${wp('-8%')}px;
    ${props => {
        if (props.noSidePadding) {
            return `
                padding:0;
            `;
        }
    }}
    ${props => {
        if (!props.noBorder) {
            return `
                border-top-left-radius: ${wp('8%')}px;
                border-top-right-radius: ${
                    Platform.OS === 'android' ? '0' : wp('8%')
                }px;`;
        }
    }}
  ${Platform.OS === 'ios' && `transform: skewY(-5deg); margin-top: -60px;`};
`;
const SkewView = styled.View`
    transform: skewY(-6deg);
    height: ${wp('15%')}px;
    width: ${wp('100%')}px;
    margin-top: ${wp('-6%')}px;
    position: absolute;
    background-color: ${props => (props.bgColor ? props.bgColor : color.white)};
    border-top-left-radius: ${wp('10%')}px;
    border-top-right-radius: ${wp('10%')}px;
`;
const InnerWrapper = styled.View`
    ${Platform.OS === 'ios' && `transform: skewY(5deg)`};
`;

export default SkewWrapper;
