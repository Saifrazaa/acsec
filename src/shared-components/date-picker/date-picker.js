import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-fontawesome-pro';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';
import {color, fonts, Iconsizes, sizes} from '../helper';
import moment from 'moment';
import ErrorText from '../error-text/error-text';

const CustDatePicker = ({
    label,
    date,
    onChange,
    disabled,
    errorText,
    isDob,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Wrapper>
            {disabled && <Disabled />}
            {label && <Label>{label}</Label>}
            <TouchableOpacity activeOpacity={1} onPress={() => setOpen(true)}>
                <DatePickerWrapper>
                    <DateText>{moment(date).format('DD/MM/YYYY')}</DateText>
                    <DateWrapper>
                        <DatePicker
                            modal
                            open={open}
                            date={date}
                            mode="date"
                            onConfirm={date => {
                                setOpen(false);
                                onChange(date);
                            }}
                            onCancel={() => {
                                setOpen(false);
                            }}
                            maximumDate={
                                isDob
                                    ? new Date(
                                          moment()
                                              .subtract(18, 'years')
                                              .calendar(),
                                      )
                                    : new Date()
                            }
                        />
                    </DateWrapper>

                    <CalenderIcon>
                        <Icon name="calendar" size={Iconsizes.size16} />
                    </CalenderIcon>
                </DatePickerWrapper>
            </TouchableOpacity>
            {errorText !== undefined && errorText !== '' && (
                <ErrorText text={errorText} marginTop />
            )}
        </Wrapper>
    );
};

const Wrapper = styled.View`
    position: relative;
`;

const Label = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyMedium};
    color: ${color.black};
`;

const DateText = styled.Text`
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroyRegular};
    color: ${color.black};
`;

const DatePickerWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: ${wp('2%')}px;
    padding: ${wp('3.5%')}px ${wp('2%')}px;
    margin-bottom: ${wp('5%')}px;
    border: 1px solid;
    border-radius: ${wp('2%')};
    border-color: ${color.inputBorder};
    flex: 1 0;
`;

const CalenderIcon = styled.View`
    padding-horizontal: ${wp('2.5%')}px;
`;

const DateWrapper = styled.View`
    padding-left: ${wp('2%')}px;
    flex: 1 0;
`;

const Disabled = styled.View`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: ${color.white}80;
`;

export default CustDatePicker;
