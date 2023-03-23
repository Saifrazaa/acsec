import React from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';
import {color, fonts, sizes} from '../helper';
import Icon from 'react-native-fontawesome-pro';

const FormButton = ({
    btnText,
    onClick,
    disabled,
    bgColor,
    btnWidth,
    borderColor,
    color,
    iconButton,
    iconName,
    iconSize,
    btnBorder,
}) => {
    return (
        <ButtonBg
            activeOpacity={0.8}
            onPress={onClick}
            borderColor={borderColor}
            btnWidth={btnWidth}
            bgColor={bgColor}
            disabled={disabled}
            isIconButton={iconButton}
            btnBorder={btnBorder}>
            {iconButton ? (
                <Icon name={iconName} size={iconSize} />
            ) : (
                <FormBtnText textColor={color}>{btnText}</FormBtnText>
            )}
        </ButtonBg>
    );
};

const FormBtnText = styled.Text`
    color: ${props => (props.textColor ? props.textColor : color.white)};
    font-size: ${sizes.font16};
    text-align: center;
    font-family: ${fonts.GilroyBold};
`;
const ButtonBg = styled.TouchableOpacity`
    background-color: ${props =>
        props.bgColor ? props.bgColor : color.primary};
    width: ${props => (props.btnWidth ? props.btnWidth : 'auto')};
    height: ${props => (props.btnHeight ? props.btnHeight : `${wp('15%')}px`)};
    justify-content: center;
    align-items: center;
    border-radius: ${wp('4%')}px;
    ${props => {
        if (props.isIconButton) {
            return `
                justify-content:center;
                align-items:center;
                padding:0;
            `;
        } else if (props.btnBorder) {
            return `
                border:1px solid;
                border-color:${props.borderColor};
            `;
        }
        if (props.disabled) {
            return `
                background-color:${color.light_grey};
            `;
        }
    }};
`;

export default FormButton;
