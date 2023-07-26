import React from 'react';
import {View, Text} from 'react-native';
import Layout from '../../components/layout';
import FormButton from '../../shared-components/button/form-button';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {color, fonts, sizes} from '../../shared-components/helper';

const Home = ({navigation}) => {
    const headerOptions = {
        heading: 'Home',
        subHeading:
            'You can view your activities list here and manage according to the completion of the activity.',
        drawerBtn: true,
    };
    const activities = [
        {
            title: 'Dummy Activity 1',
            status: 'Completed',
            deadline: '22 Aug, 2024',
        },
        {
            title: 'Dummy Activity 2',
            status: 'In-Complete',
            deadline: '22 Aug, 2024',
        },
        {
            title: 'Dummy Activity 2',
            status: 'In-Complete',
            deadline: '22 Aug, 2024',
        },
        {
            title: 'Dummy Activity 2',
            status: 'In-Complete',
            deadline: '22 Aug, 2024',
        },
        {
            title: 'Dummy Activity 2',
            status: 'In-Complete',
            deadline: '22 Aug, 2024',
        },
        {
            title: 'Dummy Activity 2',
            status: 'In-Complete',
            deadline: '22 Aug, 2024',
        },
        {
            title: 'Dummy Activity 2',
            status: 'In-Complete',
            deadline: '22 Aug, 2024',
        },
    ];
    return (
        <>
            <Layout withHeader headerOptions={headerOptions}>
                <Heading>My Activities:</Heading>
                <ListWrapper>
                    {activities?.length &&
                        activities.map((item, index) => {
                            return (
                                <ListItem key={index}>
                                    <View>
                                        <Label>{item.title}</Label>
                                        <Status>
                                            Status:{' '}
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        fonts.GilroySemiBold,
                                                }}>
                                                {item.status}
                                            </Text>
                                        </Status>
                                    </View>
                                    <View>
                                        <CompletionDate>
                                            <Status>{item.deadline}</Status>
                                        </CompletionDate>
                                    </View>
                                </ListItem>
                            );
                        })}
                </ListWrapper>
            </Layout>
            <Layout noScroll footer bgColor={color.white}>
                <FooterBtnWrap>
                    <FormButton btnText="Add New Activity" btnWidth="100%" />
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

export default Home;
