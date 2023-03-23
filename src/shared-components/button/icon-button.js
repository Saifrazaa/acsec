import React from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-fontawesome-pro';

import {color, fonts, Iconsizes, sizes} from '../helper';

const IconButton = ({
    btnColor,
    bgColor,
    iconName,
    onPress,
    withText,
    text,
    padding,
    filterApplied,
    isLoading,
}) => {
    return (
        <Wrapper
            withText={withText}
            btnColor={btnColor}
            bgColor={bgColor}
            padding={padding}
            onPress={() => onPress()}>
            {isLoading !== undefined && isLoading ? (
                <ActivityIndicator color={color.primary} size="small" />
            ) : (
                <>
                    <Icon
                        name={iconName}
                        color={btnColor}
                        size={Iconsizes.size18}
                    />
                    {withText && <BtnText>{text}</BtnText>}
                    {filterApplied && <RedDot />}
                </>
            )}
        </Wrapper>
    );
};
const Wrapper = styled.TouchableOpacity`
    background-color: ${props =>
        props.bgColor ? props.bgColor : color.app_bg};
    padding: ${props => (props.padding ? props.padding : `${wp('3%')}px`)};
    border-radius: ${wp('2%')}px;
    justify-content: center;
    align-items: center;
    height: ${wp('11%')}px;
    width: ${wp('11%')}px;
    position: relative;
    ${props => {
        if (props.withText) {
            return `
                flex-direction:row;
                padding-left:0px;
                height:auto;
                width:auto;
            `;
        }
    }}
`;
const BtnText = styled.Text`
    font-size: ${sizes.font16};
    color: ${color.white};
    font-family: ${fonts.GilroyMedium};
    margin-left: ${wp('1%')}px;
`;
const RedDot = styled.View`
    position: absolute;
    height: ${wp('2%')}px;
    width: ${wp('2%')}px;
    border-radius: ${wp('50%')}px;
    background-color: ${color.primary};
    right: ${wp('2%')}px;
    top: ${wp('2%')}px;
`;
export default IconButton;
