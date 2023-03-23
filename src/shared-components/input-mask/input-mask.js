import React, {useState} from 'react';
import {Platform} from 'react-native';
import MaskInput from 'react-native-mask-input';
72;
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';
import ErrorText from '../error-text/error-text';
import {color, fonts, mobileScreen, sizes} from '../helper';

const InputMask = ({
    placeholder,
    value,
    onValueChange,
    mask,
    keyboardType,
    bordercolor,
    label,
    prefix,
    errorText,
}) => {
    const [IsFocused, setIsFocused] = useState(false);
    return (
        <Wrapper>
            {label && <Label>{label}</Label>}
            <InputWrap
                placeholder={placeholder}
                placeholderTextColor={color.light_grey}
                value={value}
                onChangeText={onValueChange}
                keyboardType={keyboardType}
                bordercolor={bordercolor}
                mask={mask}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                IsFocused={IsFocused}
                prefix={prefix}
            />
            {errorText !== undefined && errorText !== '' && (
                <ErrorText text={errorText} marginTop />
            )}
        </Wrapper>
    );
};

const Wrapper = styled.View`
    margin-bottom: ${wp('5%')}px;
`;

const Label = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyMedium};
    color: ${color.black};
`;

const InputWrap = styled(MaskInput)`
    padding: 0 ${wp('2%')}px;
    height: ${Platform.OS === 'ios' ? wp('12%') : wp('13%')}px;
    font-size: ${mobileScreen ? `${sizes.font16}` : `${sizes.font12}`};
    color: ${color.black};
    font-family: ${fonts.GilroyRegular};
    border: 1px solid;
    border-color: ${props =>
        props.bordercolor ? props.bordercolor : `${color.inputBorder}`};
    border-radius: ${wp('2%')}px;
    margin-top: ${wp('2%')}px;
    padding-left: ${wp('3%')}px;
    ${props => {
        if (props.IsFocused) {
            return `
                border-color:${color.primary}
            `;
        }
    }}
`;

export default InputMask;
