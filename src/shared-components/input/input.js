import React, {useState} from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';
import {color, fonts, mobileScreen, sizes} from '../helper';
import Icon from 'react-native-fontawesome-pro';
import ErrorText from '../error-text/error-text';
import {Platform} from 'react-native';

const Input = ({
    placeholder,
    value,
    onValueChange,
    keyboardType,
    noflines,
    multiline,
    bordercolor,
    label,
    passwordInput,
    disabled,
    noBorder,
    errorText,
}) => {
    const [secure, setSecure] = useState(true);
    const [IsFocused, setIsFocused] = useState(false);

    return (
        <Wrapper>
            <InputWrapper pointerEvents={disabled ? 'none' : 'auto'}>
                {label && <Label>{label}</Label>}
                <InputWrap
                    placeholder={placeholder}
                    placeholderTextColor={color.light_grey}
                    value={value}
                    onChangeText={onValueChange}
                    keyboardType={keyboardType}
                    numberOfLines={noflines}
                    multiline={multiline}
                    bordercolor={bordercolor}
                    textAlignVertical={noflines ? 'top' : null}
                    secureTextEntry={passwordInput && secure}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    IsFocused={IsFocused}
                    disabled={disabled}
                    noBorder={noBorder}
                    style={{padding: multiline ? 10 : 0}}
                />
                {errorText !== undefined && errorText !== '' && (
                    <ErrorText text={errorText} marginTop />
                )}
                {passwordInput ? (
                    <EyeIcon
                        activeOpacity={0.9}
                        onPress={() => setSecure(!secure)}>
                        <Icon
                            name={secure ? 'eye-slash' : 'eye'}
                            color={color.black}
                        />
                    </EyeIcon>
                ) : null}
            </InputWrapper>
        </Wrapper>
    );
};

const InputWrap = styled.TextInput`
    min-height: ${Platform.OS === 'ios' ? wp('12%') : wp('13%')}px;
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
        if (props.disabled) {
            return `
                background-color:${color.lightest_gray}
            `;
        }
        if (props.noBorder) {
            return `
                border:none;
            `;
        }
    }}
`;

const Label = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyMedium};
    text-align: ${props => (props.labelAlignRight ? 'right' : 'left')};
    color: ${color.black};
`;

const EyeIcon = styled.TouchableOpacity`
    position: absolute;
    right: ${wp('3%')}px;
    padding: ${wp('2%')}px 0;
    top: ${Platform.OS === 'android' ? wp('8%') : wp('6.5%')}px;
`;

const InputWrapper = styled.View`
    position: relative;
    width: 100%;
    margin-bottom: ${wp('4%')}px;
`;

const Wrapper = styled.View`
    flex-direction: row;
    align-items: flex-end;
    opacity: ${props => (props.disabled ? '0.5' : '1')};
`;

export default Input;
