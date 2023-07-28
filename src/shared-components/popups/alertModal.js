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
import ErrorText from '../error-text/error-text';

const AlertModal = ({
    isVisible,
    onClose,
    title,
    referModal,
    text,
    btnText,
    noButton,
    onClickBtn,
    errModal,
    errMsgs,
    jobTitle,
    referDetail,
}) => {
    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent
                visible={isVisible}
                onRequestClose={onClose}>
                <ModalWrapper visible={isVisible} />
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
                        <IconWrapper>
                            {(!errModal && (
                                <Icon
                                    name="circle-check"
                                    color={color.primary}
                                    size={Iconsizes.size40}
                                />
                            )) || (
                                // <Icon
                                //     name="circle-exclamation"
                                //     color={color.primary}
                                //     size={Iconsizes.size40}
                                // />
                                <></>
                            )}
                        </IconWrapper>
                        <ModalTitle>{title}</ModalTitle>
                        <ModalPara>
                            {text}
                            {jobTitle && (
                                <ModalPara color={color.primary} bold>
                                    {jobTitle}
                                </ModalPara>
                            )}
                        </ModalPara>
                        {errModal &&
                            errMsgs &&
                            errMsgs.length > 0 &&
                            Array.isArray(errMsgs) &&
                            errMsgs.map((msg, index) => {
                                return (
                                    <ErrMsgWrapper key={index}>
                                        <Dot />
                                        <ErrorText text={msg} />
                                    </ErrMsgWrapper>
                                );
                            })}
                        {errModal && errMsgs && !Array.isArray(errMsgs) && (
                            <ErrMsgWrapper>
                                <Dot />
                                <ErrorText text={errMsgs} />
                            </ErrMsgWrapper>
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
                                    marginTop: wp('10%'),
                                },
                            ]}>
                            <FormButton
                                btnText={btnText}
                                bgColor={color.primary}
                                borderColor={color.primary}
                                color={color.white}
                                btnBorder
                                onClick={onClickBtn}
                            />
                        </ModalButtonWrap>
                    )}
                </ModalWrap>
            </Modal>
        </>
    );
};

export default AlertModal;

const ErrMsgWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: ${wp('2%')}px;
`;

const Dot = styled.View`
    height: ${wp('2%')}px;
    width: ${wp('2%')}px;
    border-radius: ${wp('50%')}px;
    background-color: ${color.primary};
    margin-right: ${wp('2%')}px;
`;

const ModalWrapper = styled.View`
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

const ModalInfoWrap = styled.View`
    padding: 0 ${wp('7%')}px;
    margin-top: ${hp('8%')}px;
`;

const ModalTitle = styled.Text`
    font-size: ${sizes.font24};
    font-family: ${fonts.GilroyBold};
    color: ${color.black};
    text-align: center;
    margin-bottom: ${wp('3%')}px;
`;

const ModalPara = styled.Text`
    font-size: ${sizes.font18};
    font-family: ${props =>
        props.bold ? fonts.GilroyBold : fonts.GilroyMedium};
    text-align: center;
    line-height: ${parseInt(sizes.font18) * 1.3}px;
    margin-bottom: ${wp('5%')}px;
    color: ${props => (props.color ? props.color : color.black)};
`;

const IconWrapper = styled.View`
    margin-bottom: ${wp('10%')}px;
    align-items: center;
`;

const ModalButtonWrap = styled.View``;
