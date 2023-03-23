import React, {useState, useRef, useContext} from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {RefreshControl} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import {useQuery} from 'react-query';
import Lightbox from 'react-native-lightbox';

import Layout from '../../components/layout';
import {
    color,
    fonts,
    handlePhoneNumber,
    sizes,
} from '../../shared-components/helper';
import MyProfile from './my-profile';
import MyJobs from './my-jobs';
import MyReferels from './my-referels';
import TabBar from '../../components/TabBar/tab-bar';
import {UserContext} from '../../context/user';
import {fetchUser} from '../../hooks/useUserData';
import {Loader, LoaderWrapper} from '../../shared-components/loader';
import AvatarInitials from '../../components/avatar-initials/avatar-initials';

const headerOptions = {
    drawerBtn: true,
};

const tabsProps = [
    {
        title: 'Profile',
    },
    {
        title: 'My Jobs',
    },
    {
        title: 'My Referrals',
    },
];

const Profile = ({navigation}) => {
    const {user, dispatchUser} = useContext(UserContext);

    const [activeIndex, setActiveIndex] = useState(0);
    const [personalInfo, setPersonalInfo] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [educations, setEducations] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [lightBoxOpen, setLightBoxOpen] = useState(false);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(100).then(() => [setRefreshing(false), resumeRefetch()]);
    }, []);

    const {isFetching, refetch: resumeRefetch} = useQuery(
        'get-profile',
        () => fetchUser(),
        {
            retry: false,
            onSuccess: data => {
                const dataNew = data?.data?.data?.details;
                setPersonalInfo(dataNew?.info);
                setResumes(dataNew?.resumes);
                setExperiences(dataNew?.experiences);
                setEducations(dataNew?.educations);

                dispatchUser({
                    type: 'SET_USER',
                    user: {
                        ...user,
                        avatar: dataNew?.info?.avatar,
                        name: dataNew?.info?.full_name,
                        email: dataNew?.info?.email,
                        phone: dataNew?.info?.phone,
                        summary: dataNew?.info?.summary,
                        profile: {
                            ...user.profile,
                            dob: dataNew?.info?.dob,
                            summary: dataNew?.info?.summary,
                            cnic: dataNew?.info?.cnic,
                            city_id: dataNew?.info?.city_id,
                            gender: dataNew?.info?.gender,
                            phone: handlePhoneNumber(user.phone),
                            alternate_phone: handlePhoneNumber(
                                dataNew?.info?.alternate_phone,
                            ),
                        },
                    },
                });
            },
            onError: err => {
                console.log('Error', err?.response?.data?.data?.message);
            },
        },
    );

    return (
        <>
            <Layout
                withHeader
                noPadding
                onChangeScrollTop
                headerOptions={headerOptions}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                stickyHeaderIndices={[2]}>
                <UserInfo>
                    <UserImgWrap>
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
                        <EditProfileBtn
                            onPress={() => navigation.navigate('EditProfile')}>
                            <Icon
                                name="pencil"
                                color={color.white}
                                size={wp('3.5%')}
                            />
                        </EditProfileBtn>
                    </UserImgWrap>
                    <UserName>{user && user.name}</UserName>
                    <UserInfoWrap>
                        <Icon
                            name="envelope"
                            size={wp('3.5%')}
                            color={color.gray_text}
                        />
                        <UserInfoText>{user && user.email}</UserInfoText>
                    </UserInfoWrap>
                    <UserInfoWrap>
                        <Icon
                            name="phone"
                            size={wp('3.5%')}
                            color={color.gray_text}
                        />
                        <UserInfoText>
                            {user && handlePhoneNumber(user.phone)}
                        </UserInfoText>
                    </UserInfoWrap>
                </UserInfo>

                <TabBar
                    tabData={tabsProps}
                    activeIndex={activeIndex}
                    onChangeTab={index => {
                        setActiveIndex(index);
                    }}
                />
                {activeIndex === 0 ? (
                    <MyProfile
                        personalInfo={personalInfo}
                        resumes={resumes}
                        experiences={experiences}
                        educations={educations}
                        onUpload={resumeRefetch}
                    />
                ) : activeIndex === 1 ? (
                    <MyJobs />
                ) : (
                    <MyReferels />
                )}
            </Layout>
            {isFetching && (
                <LoaderWrapper>
                    <Loader size={wp('12%')} />
                </LoaderWrapper>
            )}
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
    margin-bottom: ${wp('4%')}px;
`;

const UserImg = styled.Image`
    height: ${props => (props.lightBoxOpen ? '50%' : '100%')};
    width: 100%;
    resize-mode: cover;
    border-radius: ${props => (props.lightBoxOpen ? 0 : `${wp('50%')}px`)};
`;

const EditProfileBtn = styled.TouchableOpacity`
    position: absolute;
    right: ${wp('-3%')}px;
    top: ${wp('22%')}px;
    background-color: ${color.primary};
    border-radius: ${wp('50%')}px;
    height: ${wp('10%')}px;
    width: ${wp('10%')}px;
    justify-content: center;
    align-items: center;
`;

const UserName = styled.Text`
    text-align: center;
    font-size: ${sizes.font24};
    font-family: ${fonts.GilroyBold};
    margin-bottom: ${wp('1%')}px;
    color: ${color.black};
`;

const UserInfoWrap = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: ${wp('1%')}px;
`;

const UserInfoText = styled.Text`
    text-align: center;
    align-items: center;
    font-size: ${sizes.font14};
    margin-left: ${wp('3%')}px;
    font-family: ${fonts.GilroyRegular};
    color: ${color.gray_text};
`;

export default Profile;
