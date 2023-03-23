import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-fontawesome-pro';

import {color, sizes, fonts, mobileScreen} from '../helper';
import {Loader} from '../loader';
import ErrorText from '../error-text/error-text';

export default CustSelect = ({
    value,
    label,
    options,
    noPlaceholder,
    disabled,
    selectedValue,
    onValueChange,
    placeholder,
    labelAction,
    labelActionText,
    errorText,
    isLoading,
    onLabelPress,
}) => {
    const [selectVal, setSelectVal] = useState('');
    const [initVal, setInitVal] = useState('');

    useEffect(() => {
        setInitVal(value);
        setSelectVal(selectedValue);
    }, [value, selectedValue]);

    return (
        <SelectWrap>
            {label && (
                <LabelWrapper>
                    <Label>{label}</Label>
                    {labelAction && (
                        <LabelAction onPress={onLabelPress}>
                            <Label clickable>{labelActionText}</Label>
                        </LabelAction>
                    )}
                </LabelWrapper>
            )}
            {isLoading && (
                <LoaderWrapper>
                    <Loader />
                </LoaderWrapper>
            )}
            <RNPickerSelect
                selectedValue={selectVal}
                onValueChange={onValueChange}
                mode="dropdown"
                useNativeAndroidPickerStyle={false}
                placeholder={
                    noPlaceholder ? {} : {label: placeholder, value: null}
                }
                disabled={disabled}
                value={initVal}
                style={{
                    inputIOS: {
                        ...pickerStyle.inputIOS,
                    },
                    inputAndroid: {
                        ...pickerStyle.inputAndroid,
                    },
                    iconContainer: {
                        top: wp('4%'),
                        right: wp('5%'),
                    },
                    placeholder: {
                        color: color.light_grey,
                    },
                }}
                items={options}
                Icon={() => {
                    return (
                        <SelectIcon>
                            <Icon
                                name="sort-down"
                                type="solid"
                                size={wp('4%')}
                                color={color.black}
                            />
                        </SelectIcon>
                    );
                }}
            />
            {errorText !== undefined && errorText !== '' && (
                <ErrorText text={errorText} marginTop />
            )}
        </SelectWrap>
    );
};

const SelectWrap = styled.View`
    margin-bottom: ${wp('5%')}px;
    position: relative;
`;

const Label = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyMedium};
    color: ${color.black};
    ${props => {
        if (props.clickable) {
            return `
                color:${color.primary};
            `;
        }
    }}
`;

const LabelWrapper = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

const LabelAction = styled.TouchableOpacity``;

const SelectIcon = styled.View`
    top: ${Platform.OS === 'android' ? wp('2%') : wp('1.5%')}px;
    z-index: -1;
`;

const pickerStyle = StyleSheet.create({
    inputIOS: {
        fontSize: wp('4%'),
        borderWidth: 1,
        borderColor: color.inputBorder,
        color: color.black,
        borderRadius: wp('2%'),
        marginTop: wp('2%'),
        fontFamily: fonts.GilroyRegular,
        paddingHorizontal: wp('3%'),
        height: wp('12%'),
    },
    inputAndroid: {
        fontSize: wp('4%'),
        borderWidth: 1,
        borderColor: color.inputBorder,
        color: color.black,
        borderRadius: wp('2%'),
        marginTop: wp('2%'),
        fontFamily: fonts.GilroyRegular,
        paddingHorizontal: wp('3%'),
        height: wp('13%'),
    },
});

const LoaderWrapper = styled.View`
    position: absolute;
    left: ${wp('0%')}px;
    width: ${wp('86%')}px;
    padding: ${wp('3%')}px;
    height: ${Platform.OS === 'ios' ? wp('12%') : wp('13%')}px;
    background-color: ${color.app_bg}25;
    bottom: 0;
    z-index: 99;
`;
