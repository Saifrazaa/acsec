import React, {useContext, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import Layout from '../../components/layout';
import FormButton from '../../shared-components/button/form-button';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {color, fonts, sizes} from '../../shared-components/helper';
import database from '@react-native-firebase/database';
import {UserContext} from '../../context/user';
import moment from 'moment';

const Home = ({navigation}) => {
    const [activities, setActivities] = useState([]);
    const {user} = useContext(UserContext);
    const headerOptions = {
        heading: 'Home',
        subHeading: 'Here is the list of your today activities.',
        drawerBtn: true,
    };

    useEffect(() => {
        database()
            .ref(
                `activities/${user.phone_no}/${moment(new Date()).format(
                    'll',
                )}`,
            )
            .once('value')
            .then(snapshot => {
                const arr = [];
                snapshot.forEach(activity => {
                    const data = {
                        ...activity.val(),
                        key: activity.key,
                    };
                    arr.push(data);
                });
                setActivities(arr);
            });
    }, []);
    return (
        <>
            <Layout withHeader headerOptions={headerOptions}>
                {activities?.length > 0 && (
                    <Heading>Today's Activities:</Heading>
                )}
                <ListWrapper>
                    {activities &&
                        activities.length > 0 &&
                        activities.map((item, index) => {
                            return (
                                <ListItem key={index}>
                                    <View>
                                        <Label>{item?.activity}</Label>
                                        <Status>
                                            Status:{' '}
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        fonts.GilroySemiBold,
                                                }}>
                                                {item.completed
                                                    ? 'Completed'
                                                    : 'In-Complete'}
                                            </Text>
                                        </Status>
                                        <Status>
                                            Type:{' '}
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        fonts.GilroySemiBold,
                                                }}>
                                                {item.type}
                                            </Text>
                                        </Status>
                                    </View>
                                    <View>
                                        <CompletionDate>
                                            <Status>
                                                {moment(item.date).format('ll')}
                                            </Status>
                                        </CompletionDate>
                                    </View>
                                </ListItem>
                            );
                        })}
                </ListWrapper>
                {(!activities || activities.length === 0) && (
                    <NotFoundWrapper>
                        <NotFound>No Activity For Today</NotFound>
                        <NotFoundImage
                            source={require('../../assets/images/not-found.png')}
                        />
                    </NotFoundWrapper>
                )}
            </Layout>
            <Layout noScroll footer bgColor={color.white}>
                <FooterBtnWrap>
                    <FormButton
                        btnText="Add New Activity"
                        btnWidth="100%"
                        onClick={() => navigation.navigate('AddActivity')}
                    />
                </FooterBtnWrap>
            </Layout>
        </>
    );
};

const Heading = styled.Text`
    font-size: ${sizes.font24};
    color: ${color.primary};
    font-family: ${fonts.GilroyBold};
    margin-left: ${wp('5%')}px;
`;

const ListWrapper = styled.View`
    padding: ${wp('5%')}px;
`;

const ListItem = styled.View`
    margin-bottom: ${wp('5%')}px;
    border-bottom-width: 1px;
    border-bottom-color: ${color.inputBorder};
    padding-bottom: ${wp('3%')};
    padding-left: ${wp('1%')}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    background-color: ${color.white['100']};
`;

const Label = styled.Text`
    font-family: ${fonts.GilroySemiBold};
    font-size: ${sizes.font14};
    color: ${color.black};
`;

const Status = styled.Text`
    font-family: ${fonts.GilroyMedium};
    font-size: ${sizes.font13};
    color: ${color.primary};
`;

const CompletionDate = styled.View``;

const FooterBtnWrap = styled.View`
    flex-direction: ${props => (props.last ? 'column' : 'row')};
    ${props => (props.last ? `height: ${wp('32%')}px` : `height: auto`)};
    justify-content: space-between;
`;

const NotFoundWrapper = styled.View`
    justify-content: center;
    align-items: center;
`;

const NotFound = styled.Text`
    font-size: ${sizes.font20};
    color: ${color.primary};
    font-family: ${fonts.GilroySemiBold};
`;

const NotFoundImage = styled.Image`
    width: 300px;
    height: 300px;
    resize-mode: contain;
`;

export default Home;
