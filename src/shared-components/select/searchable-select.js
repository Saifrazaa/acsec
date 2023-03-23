import {
    View,
    Text,
    Platform,
    TextInput,
    TouchableOpacity,
    Button,
    StyleSheet,
    ScrollView,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {color, fonts, sizes} from '../helper';
import {Loader} from '../loader';
import Icon from 'react-native-fontawesome-pro';
import Modal from 'react-native-modal';
import ErrorText from '../error-text/error-text';

const SearchableSelect = ({
    label,
    isLoading,
    data,
    errorText,
    onValueChange,
    value,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [list, setList] = useState([]);
    const [query, setQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    let queriedList = useMemo(() => filterList(list, query), [list, query]);

    function filterList(list, query) {
        if (!query || !list.length) {
            return list;
        }
        const regex = new RegExp(`${query.trim()}`, 'i');
        return list.filter(item => item.label.search(regex) >= 0);
    }

    const toggleVisibility = () => {
        if (!isVisible) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const handleValueChange = value => () => {
        onValueChange(value);
        toggleVisibility();
    };

    useEffect(() => {
        if (value) {
            const newList = [...list];
            const item = newList.find(l => l.value === value);
            if (item) {
                setSelectedItem(item.label);
            } else {
                setSelectedItem('');
            }
        } else {
            handleValueChange('');
            setSelectedItem('');
        }
    }, [value]);

    useEffect(() => {
        if (isVisible) {
            setList(data);
        } else {
            setQuery('');
            setList([]);
        }
    }, [isVisible]);

    return (
        <>
            {isVisible && (
                <Modal
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    isVisible={isVisible}
                    backdropColor="rgba(0,0,0,0.85)"
                    onBackdropPress={toggleVisibility}
                    style={styles.modalRoot}>
                    <View style={styles.modalContent}>
                        <SearchInput
                            placeholder="Search locations"
                            placeholderTextColor={color.light_grey}
                            onChangeText={text => setQuery(text)}
                            value={query}
                        />
                        <ScrollView>
                            <ListItem onPress={handleValueChange('')}>
                                <ListLabel>Select Location</ListLabel>
                            </ListItem>
                            {queriedList.map((item, index) => (
                                <ListItem
                                    key={index}
                                    onPress={handleValueChange(item.value)}>
                                    <ListLabel>{item.label}</ListLabel>
                                </ListItem>
                            ))}
                        </ScrollView>
                    </View>
                </Modal>
            )}
            <SelectWrap>
                {label && (
                    <LabelWrapper>
                        <Label>{label}</Label>
                    </LabelWrapper>
                )}
                {isLoading && (
                    <LoaderWrapper>
                        <Loader />
                    </LoaderWrapper>
                )}
                <PickerSelect onPress={toggleVisibility}>
                    {selectedItem === '' ? (
                        <SelectValue placeholder numberOfLines={1}>
                            Select Location
                        </SelectValue>
                    ) : (
                        <SelectValue numberOfLines={1}>
                            {selectedItem}
                        </SelectValue>
                    )}
                    <Icon
                        name="sort-down"
                        type="solid"
                        size={wp('4%')}
                        color={color.black}
                    />
                </PickerSelect>
                {errorText !== undefined && errorText !== '' && (
                    <ErrorText text={errorText} marginTop />
                )}
            </SelectWrap>
        </>
    );
};

export default SearchableSelect;

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

const PickerSelect = styled.TouchableOpacity`
    border-width: 1px;
    border-color: ${color.inputBorder};
    margin-top: ${wp('2%')}px;
    padding-horizontal: ${wp('3%')}px;
    height: ${wp('13%')}px;
    border-radius: ${wp('2%')}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const SelectValue = styled.Text`
    font-size: ${wp('4%')}px;
    color: ${props => (props.placeholder ? color.light_grey : color.black)};
    font-family: ${fonts.GilroyRegular};
    flex-grow: 1;
    margin-right: ${wp('1%')}px;
`;

const SearchInput = styled.TextInput`
    font-family: ${fonts.GilroyRegular};
    color: ${color.black};
    padding: ${wp('3%')}px ${wp('4%')}px;
    border-bottom-width: 1px;
    border-color: ${color.inputBorder};
`;

const ListItem = styled.TouchableOpacity`
    padding: ${wp('3%')}px ${wp('4%')}px;
`;

const ListLabel = styled.Text`
    font-size: ${wp('4%')}px;
    color: ${color.black};
    font-family: ${fonts.GilroyMedium};
    flex-grow: 1;
`;

const styles = StyleSheet.create({
    modalRoot: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: color.white,
        width: '98%',
        maxHeight: '70%',
        borderRadius: wp('1%'),
    },
});
