import React from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-fontawesome-pro';

import {color, fonts, Iconsizes, sizes} from '../helper';
import FormButton from '../button/form-button';

const UploadModal = ({
    errModal,
    btnText,
    isVisible,
    onClose,
    onPessUpload,
    onPressDelete,
}) => {
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
                        backgroundColor: `transparent`,
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                    }}>
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
                                marginTop: wp('10%'),
                            },
                        ]}>
                        <ModalCloseBtn onPress={onClose}>
                            <Icon
                                name="xmark"
                                size={Iconsizes.size20}
                                color={color.gray}
                            />
                        </ModalCloseBtn>
                        <FormButton
                            btnText={'Upload New Image'}
                            bgColor={color.primary}
                            borderColor={color.primary}
                            color={color.white}
                            btnBorder
                            onClick={onPessUpload}
                        />
                        <FormButton
                            btnText={'Delete'}
                            bgColor={'transparent'}
                            color={color.primary}
                            onClick={onPressDelete}
                        />
                    </ModalButtonWrap>
                </ModalWrap>
            </Modal>
        </>
    );
};

const ModalWrapper = styled.TouchableOpacity`
    background-color: ${color.black}4D;
    position: absolute;
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

const ModalCloseBtn = styled.TouchableOpacity`
    margin-top: ${wp('3%')}px;
    margin-bottom: ${wp('7%')}px;
    align-items: flex-end;
`;

const ModalButtonWrap = styled.View``;

export default UploadModal;
