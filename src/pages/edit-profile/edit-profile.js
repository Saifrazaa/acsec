import React, {useState, useContext} from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import Lightbox from 'react-native-lightbox';
import Icon from 'react-native-fontawesome-pro';
import {ActivityIndicator, Platform, KeyboardAvoidingView} from 'react-native';

import FormButton from '../../shared-components/button/form-button';
import Layout from '../../components/layout';
import {color} from '../../shared-components/helper';
import PersonalInfoEdit from './personal-info-edit';
import PasswordEdit from './password-edit';
import TabBar from '../../components/TabBar/tab-bar';
import UploadModal from '../../shared-components/popups/uploadModal';
import {UserContext} from '../../context/user';
import AvatarInitials from '../../components/avatar-initials/avatar-initials';
import {useAvatarDelete, useAvatarUpdate} from '../../hooks/useUserData';
import AlertModal from '../../shared-components/popups/alertModal';
import {Loader, LoaderWrapper} from '../../shared-components/loader';

const headerOptions = {
    backBtn: true,
    btnText: 'Back',
    backBtnAction: {
        screen: 'Profile',
    },
};

const tabsProps = [
    {
        title: 'Profile',
    },

    {
        title: 'Password',
    },
];

const EditProfile = ({navigation}) => {
    const {user, dispatchUser} = useContext(UserContext);

    const [activeIndex, setActiveIndex] = useState(0);
    const [uploadModal, setUploadModal] = useState(false);
    const [lightBoxOpen, setLightBoxOpen] = useState(false);
    const [errModal, setErrModal] = useState(false);
    const [updateInfo, setUpdateInfo] = useState(false);
    const [changePasswrd, setChangePasswrd] = useState(false);
    const [errMsgs, setErrMsgs] = useState('');
    const [loader, setLoader] = useState(false);

    // Upload User Picture
    const {mutate: UpdateAvatar, isLoading: avatarUpdating} = useAvatarUpdate({
        onSuccess: data => {
            if (data?.data?.data?.status === 200) {
                dispatchUser({
                    type: 'SET_USER',
                    user: {
                        ...user,
                        avatar: data?.data?.data?.details?.avatar_link,
                    },
                });
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            setErrMsgs(response?.data?.message);
        },
    });

    const uploadNewImage = () => {
        setTimeout(() => {
            ImagePicker.openPicker({
                cropping: true,
                height: 300,
                width: 300,
            })
                .then(image => {
                    const img = {
                        filename:
                            'image-' + Math.floor(Math.random() * 100 + 1),
                        name: 'image-' + Math.floor(Math.random() * 100 + 1),
                        type: image.mime,
                        uri:
                            Platform.OS === 'android'
                                ? image.path
                                : image.sourceURL,
                    };
                    const avatarData = new FormData();
                    avatarData.append('avatar', img);
                    UpdateAvatar(avatarData);
                })
                .catch(e => {
                    console.log('Error: ', e);
                });
        }, 1000);
    };

    // Delete User Picture
    const {mutate: DeleteAvatar, isLoading: avatarDeleting} = useAvatarDelete({
        onSuccess: data => {
            if (data?.data?.data?.status === 200) {
                dispatchUser({
                    type: 'SET_USER',
                    user: {
                        ...user,
                        avatar: '',
                    },
                });
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            setErrMsgs(response?.data?.message);
        },
    });

    const deleteImage = async () => {
        await DeleteAvatar();
    };

    return (
        <>
            <KeyboardAvoidingView
                behavior="padding"
                style={{flexGrow: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -400}>
                <Layout
                    withHeader
                    noPadding
                    headerOptions={headerOptions}
                    stickyHeaderIndices={[2]}>
                    <UserInfo>
                        <UserImgWrap>
                            {(avatarUpdating || avatarDeleting) && (
                                <LoaderWrapper width={'100%'} borderRadius>
                                    <Loader size={wp('12%')} />
                                </LoaderWrapper>
                            )}
                            {(user?.avatar !== undefined &&
                                user?.avatar !== '' && (
                                    <Lightbox
                                        underlayColor="transparent"
                                        willClose={() => setLightBoxOpen(false)}
                                        didOpen={() => setLightBoxOpen(true)}>
                                        <UserImg
                                            source={{uri: user.avatar}}
                                            lightBoxOpen={lightBoxOpen}
                                        />
                                    </Lightbox>
                                )) || <AvatarInitials name={user.name} />}
                            {!(avatarUpdating || avatarDeleting) && (
                                <EditImgBtn
                                    onPress={() => setUploadModal(true)}>
                                    <Icon
                                        name="pencil"
                                        color={color.white}
                                        size={wp('3.5%')}
                                    />
                                </EditImgBtn>
                            )}
                        </UserImgWrap>
                    </UserInfo>
                    <TabBar
                        tabData={tabsProps}
                        activeIndex={activeIndex}
                        onChangeTab={index => {
                            setActiveIndex(index);
                        }}
                    />
                    {activeIndex === 0 ? (
                        <PersonalInfoEdit
                            handleSubmit={updateInfo}
                            checkLoadingState={val => setLoader(val)}
                            changeSubmitState={val => setUpdateInfo(val)}
                        />
                    ) : (
                        <PasswordEdit
                            handleSubmit={changePasswrd}
                            checkLoadingState={val => setLoader(val)}
                            changeSubmitState={val => setChangePasswrd(val)}
                        />
                    )}
                </Layout>
                <Layout noScroll footer bgColor={color.white}>
                    <FooterBtnWrap>
                        <FormButton
                            btnText={
                                loader ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={color.white}
                                    />
                                ) : (
                                    'Save'
                                )
                            }
                            btnWidth="100%"
                            onClick={() => {
                                if (activeIndex === 0) {
                                    setUpdateInfo(true);
                                } else {
                                    setChangePasswrd(true);
                                }
                            }}
                        />
                    </FooterBtnWrap>
                </Layout>
            </KeyboardAvoidingView>

            <UploadModal
                isVisible={uploadModal}
                onPessUpload={() => [uploadNewImage(), setUploadModal(false)]}
                onPressDelete={() => [deleteImage(), setUploadModal(false)]}
                onClose={() => setUploadModal(false)}
            />
            <AlertModal
                title="Request Failed"
                text={errMsgs}
                btnText="Retry"
                errModal
                isVisible={errModal}
                onClickBtn={() => {
                    setErrModal(false);
                }}
            />
        </>
    );
};

const UserInfo = styled.View`
    align-self: center;
`;

const UserImgWrap = styled.View`
    height: ${wp('40%')}px;
    width: ${wp('40%')}px;
    align-self: center;
    margin-top: ${-wp('25%')}px;
    border-width: 3px;
    border-radius: ${wp('50%')}px;
    border-color: ${color.white};
`;

const UserImg = styled.Image`
    height: ${props => (props.lightBoxOpen ? '50%' : '100%')};
    width: 100%;
    resize-mode: cover;
    border-radius: ${props => (props.lightBoxOpen ? 0 : `${wp('50%')}px`)};
`;
const EditImgBtn = styled.TouchableOpacity`
    position: absolute;
    right: ${wp('-3%')}px;
    top: ${wp('22%')}px;
    background-color: ${color.primary};
    border-radius: ${wp('50%')}px;
    height: ${wp('10%')}px;
    width: ${wp('10%')}px;
    justify-content: center;
    align-items: center;
    elevation: 10;
`;

const FooterBtnWrap = styled.View`
    flex-direction: row;
    height: auto;
    justify-content: space-between;
`;

export default EditProfile;
