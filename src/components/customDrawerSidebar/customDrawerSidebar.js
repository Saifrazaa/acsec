import React, { useContext } from 'react';
import styled from 'styled-components';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import {
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
    color,
    fonts,
    handlePhoneNumber,
    Iconsizes,
    sizes,
} from '../../shared-components/helper';
import Icon from 'react-native-fontawesome-pro';
import IconButton from '../../shared-components/button/icon-button';
import { logout } from '../../utils/token-manager';
import { UserContext } from '../../context/user';
import AvatarInitials from '../avatar-initials/avatar-initials';

const CustomDrawerSidebar = props => {
    const { user, dispatchUser } = useContext(UserContext);
    const handleLogout = () => {
        dispatchUser({
            type: 'CLEAR_USER',
            user: {
                loggedIn: false,
            },
        });
        logout();
        props.navigation.closeDrawer();
    };

    return (
        <>
            <HeaderWrapper>
                <IconButton
                    btnColor={color.white}
                    bgColor={`${color.white}33`}
                    iconName="xmark"
                    onPress={() => props.navigation.closeDrawer()}
                />
                <UserBlock>
                    <ImageWrapper>
                        {(user?.avatar !== undefined && user?.avatar !== '' && (
                            <UserImg source={{ uri: user.avatar }} />
                        )) || (
                                <AvatarInitials
                                    name={user.name}
                                    fontSize={sizes.font18}
                                />
                            )}
                    </ImageWrapper>
                    <UserInfo>
                        <UserName>{user.name}</UserName>
                        <InfoBlock>
                            <Icon
                                name="envelope"
                                size={Iconsizes.size12}
                                color={color.white}
                            />
                            <InfoText>{user && user.email}</InfoText>
                        </InfoBlock>
                        <InfoBlock>
                            <Icon
                                name="phone"
                                size={Iconsizes.size12}
                                color={color.white}
                            />
                            <InfoText>
                                {user && handlePhoneNumber(user.phone)}
                            </InfoText>
                        </InfoBlock>
                    </UserInfo>
                    <EditProfileBtn
                        onPress={() => props.navigation.navigate('Profile')}>
                        <Icon
                            name="pencil"
                            type="light"
                            size={Iconsizes.size14}
                            color={color.white}
                        />
                    </EditProfileBtn>
                </UserBlock>
            </HeaderWrapper>
            <Wrapper scrollEnabled={true}>
                <DrawerItemList {...props} />
            </Wrapper>

            <SignoutWrap>
                <Menu onPress={handleLogout}>
                    <Icon
                        name="arrow-right-from-bracket"
                        color={color.white}
                        size={Iconsizes.size18}
                    />
                    <MenuTitle>Sign Out</MenuTitle>
                </Menu>
            </SignoutWrap>
        </>
    );
};

const HeaderWrapper = styled.View`
    padding: 0 ${wp('5%')}px;
    margin-top: ${wp('13%')}px;
`;

const Wrapper = styled(DrawerContentScrollView)`
    padding: 0 ${wp('2.5%')}px;
    margin-bottom: ${wp('5%')}px;
`;
const Menu = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding: ${wp('5.5%')}px ${wp('3%')}px;
    padding-left: ${wp('10%')}px;
    ${props => {
        if (props.lastItem) {
            return `
                margin-top: auto;
            `;
        }
    }}
`;
const SignoutWrap = styled.SafeAreaView`
    margin-bottom: ${wp('5%')}px;
`;
const MenuTitle = styled.Text`
    color: ${color.white};
    margin-left: ${wp('7%')}px;
    font-family: ${fonts.GilroyMedium};
    font-size: ${sizes.font14};
`;
const UserBlock = styled.View`
    padding: 0 ${wp('3%')}px;
    background-color: ${color.white}33;
    margin-top: ${wp('5%')}px;
    border-radius: ${wp('3%')}px;
    flex-direction: row;
    align-items: center;
    padding-top: ${wp('5%')}px;
    padding-bottom: ${wp('7%')}px;
`;
const UserInfo = styled.View`
    flex: 1 0;
`;
const InfoBlock = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: ${wp('0.7%')}px;
`;
const UserImg = styled.Image`
    border-width: 1px;
    border-color: ${color.white};
    border-radius: ${wp('50%')}px;
    height: 100%;
    width: 100%;
`;

const ImageWrapper = styled.View`
    height: ${wp('13%')}px;
    width: ${wp('13%')}px;
    margin-right: ${wp('3%')}px;
`;

const UserName = styled.Text`
    color: ${color.white};
    font-size: ${sizes.font20};
    font-family: ${fonts.GilroyBold};
`;
const InfoText = styled.Text`
    font-size: ${sizes.font12};
    color: ${color.white};
    margin-left: ${wp('1%')}px;
    font-family: ${fonts.GilroyRegular};
`;
const EditProfileBtn = styled.TouchableOpacity`
    background-color: ${color.primary};
    elevation: 10;
    height: ${wp('7%')}px;
    width: ${wp('7%')}px;
    align-items: center;
    justify-content: center;
    border-radius: ${wp('50%')}px;
    position: absolute;
    right: ${wp('2%')}px;
    bottom: ${wp('2%')}px;
`;
export default CustomDrawerSidebar;
