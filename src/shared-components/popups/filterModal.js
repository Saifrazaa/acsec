import React, {useEffect, useState} from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {color, fonts, sizes} from '../helper';
import FormButton from '../button/form-button';

const FilterModal = ({
    isVisible,
    onClose,
    noButton,
    jobs,
    onApplyFilter,
    onClearFilter,
    filterVals,
}) => {
    const [locations, setLocations] = useState([]);
    const [departments, setDepartments] = useState([]);

    const handleLocations = data => {
        const locations = ['All'];
        data?.map(item => {
            item?.metadata?.crx_location?.map(location => {
                locations.push(location.name);
            });
        });
        let unique = [...new Set(locations)];
        setLocations(unique);
    };

    const handleDepartments = data => {
        const departments = ['All'];
        data?.map(item => {
            departments.push(item?.post_terms[0]?.name);
        });
        let unique = [...new Set(departments)];
        setDepartments(unique);
    };

    const resetFilter = () => {
        filterVals.setSelectedDepart(0);
        filterVals.setSelectedLoc(0);
    };

    useEffect(() => {
        handleLocations(jobs);
        handleDepartments(jobs);
    }, [jobs]);

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent
                visible={isVisible}
                onRequestClose={onClose}>
                <ModalWrapper visible={isVisible} onPress={onClose} />
                <ModalWrap
                    style={{
                        backgroundColor: `${color.white}`,
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        shadowColor: '#E8E8E8',
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.2,
                        shadowRadius: 1.41,
                        elevation: 4,
                    }}>
                    <ModalInfoWrap>
                        <ModalHeading>Filter your Dream Job By:</ModalHeading>
                        {locations && locations.length > 0 && (
                            <>
                                <SectionHeading>Location</SectionHeading>
                                <FilterSection>
                                    {locations.map((item, index) => {
                                        return (
                                            <SelectablePill
                                                key={index}
                                                active={
                                                    index ===
                                                    filterVals.selectedLoc
                                                }
                                                onPress={() =>
                                                    filterVals.setSelectedLoc(
                                                        index,
                                                    )
                                                }>
                                                <LocationTxt
                                                    active={
                                                        index ===
                                                        filterVals.selectedLoc
                                                    }>
                                                    {item}
                                                </LocationTxt>
                                            </SelectablePill>
                                        );
                                    })}
                                </FilterSection>
                            </>
                        )}
                        {departments && departments.length > 0 && (
                            <>
                                <SectionHeading>Department</SectionHeading>
                                <FilterSection>
                                    {departments.map((item, index) => {
                                        return (
                                            <SelectablePill
                                                key={index}
                                                active={
                                                    index ===
                                                    filterVals.selectedDepart
                                                }
                                                onPress={() =>
                                                    filterVals.setSelectedDepart(
                                                        index,
                                                    )
                                                }>
                                                <LocationTxt
                                                    active={
                                                        index ===
                                                        filterVals.selectedDepart
                                                    }>
                                                    {item}
                                                </LocationTxt>
                                            </SelectablePill>
                                        );
                                    })}
                                </FilterSection>
                            </>
                        )}
                    </ModalInfoWrap>

                    {!noButton && (
                        <ModalButtonWrap
                            style={[
                                {
                                    backgroundColor: color.white,
                                    borderTopRightRadius: wp('8%'),
                                    borderTopLeftRadius: wp('8%'),
                                    shadowColor: color.black,
                                    shadowOffset: {
                                        width: 0,
                                        height: -5,
                                    },
                                    shadowOpacity: 0.03,
                                    shadowRadius: 4,
                                    elevation: 20,
                                    padding: wp('5%'),
                                },
                            ]}>
                            <FormButton
                                bgColor={color.lightest_gray}
                                btnWidth={'29%'}
                                btnText={'Clear All'}
                                color={color.black}
                                onClick={() => {
                                    resetFilter();
                                    onClose();
                                    onClearFilter();
                                }}
                            />
                            <FormButton
                                btnWidth={'69%'}
                                btnText={'Apply Filters'}
                                onClick={() => {
                                    onApplyFilter({
                                        location:
                                            locations[filterVals.selectedLoc],
                                        department:
                                            departments[
                                                filterVals.selectedDepart
                                            ],
                                    });
                                    onClose();
                                }}
                            />
                        </ModalButtonWrap>
                    )}
                </ModalWrap>
            </Modal>
        </>
    );
};

export default FilterModal;

const ModalWrapper = styled.TouchableOpacity`
    background-color: ${color.black}4D;
    position: absolute;
    top: 0;
    ${props => {
        if (props.visible) {
            return `
                height: ${hp('100%')}px;
                width: ${wp('100%')}px;
            `;
        }
    }}
`;

const ModalWrap = styled.View`
    justify-content: flex-end;
    border-top-right-radius: ${wp('8%')}px;
    border-top-left-radius: ${wp('8%')}px;
`;

const ModalHeading = styled.Text`
    font-size: ${sizes.font24};
    margin-bottom: ${wp('7%')}px;
    font-family: ${fonts.GilroyBold};
    color: ${color.black};
`;

const ModalInfoWrap = styled.View`
    padding: 0 ${wp('7%')}px;
    margin-top: ${hp('5%')}px;
`;

const ModalButtonWrap = styled.View`
    flex-direction: row;
    height: auto;
    justify-content: space-between;
`;

const SectionHeading = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyMedium};
    margin-bottom: ${wp('2%')}px;
    color: ${color.black};
`;

const SelectablePill = styled.TouchableOpacity`
    padding: ${wp('2%')}px ${wp('5%')}px;
    border: 1px solid;
    border-color: ${color.primary};
    border-radius: ${wp('10%')}px;
    margin-right: ${wp('1.5%')}px;
    margin-vertical: ${wp('1%')}px;
    ${props => {
        if (props.active) {
            return `
                background-color:${color.primary};
            `;
        }
    }}
`;

const FilterSection = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: ${wp('10%')}px;
`;

const LocationTxt = styled.Text`
    font-family: ${fonts.GilroyMedium};
    font-size: ${sizes.font14};
    color: ${props => (props.active ? color.white : color.black)};
`;
