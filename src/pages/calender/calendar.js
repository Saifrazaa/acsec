import React, {useContext, useEffect, useState} from 'react';
import database from '@react-native-firebase/database';

import Layout from '../../components/layout';
import {UserContext} from '../../context/user';
import {Agenda} from 'react-native-calendars';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MainHeader from '../../components/header';
import styled from 'styled-components';
import {color, fonts, sizes} from '../../shared-components/helper';
import moment from 'moment';

const headerOptions = {
    heading: 'My Calendar',
    subHeading: 'Below is the schedule of my activities.',
    drawerBtn: true,
};

const CalendarSchedule = () => {
    const [data, setData] = useState([]);
    const [activities, setActivities] = useState({});
    const {user} = useContext(UserContext);

    useEffect(() => {
        const arr = [];
        database()
            .ref(`activities/${user.phone_no}`)
            .once('value')
            .then(snapshot => {
                snapshot.forEach(activity => {
                    activity.forEach(activity2 => {
                        arr.push(activity2.val());
                    });
                });
            });
        setData(arr);
    }, [activities]);
    const timeToString = time => {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    };

    const loadItems = day => {
        const items = {};

        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                if (!items[strTime]) {
                    items[strTime] = [];
                    items[strTime].push({
                        activity: handleActivity(strTime),
                    });
                }
            }
            const newItems = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
            });
            setActivities(newItems);
        }, 1000);
    };

    const handleActivity = day => {
        const arr = [];
        data.map(d => {
            if (d.date === moment(day).format('ll')) {
                arr.push(d);
            }
        });
        if (arr.length > 0) {
            return arr;
        } else {
            return null;
        }
    };

    const renderItem = item => {
        if (item.activity) {
            return (
                <View style={{marginTop: 30}}>
                    {item.activity.map((d, index) => {
                        return (
                            <TouchableOpacity key={index}>
                                <Card>
                                    <CardContent>
                                        <View>
                                            <Heading>
                                                To-do: {d.activity}
                                            </Heading>
                                            <Status>
                                                Status:{' '}
                                                {d.completed
                                                    ? 'Completed'
                                                    : 'In-Complete'}
                                            </Status>
                                            <Type>Type: {d.type}</Type>
                                        </View>
                                    </CardContent>
                                </Card>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        }
    };

    return (
        <>
            <MainHeader headerOptions={headerOptions} />
            <View style={{flex: 1, marginTop: -20}}>
                <Agenda
                    items={activities}
                    loadItemsForMonth={loadItems}
                    renderItem={renderItem}
                    showClosingKnob={true}
                />
            </View>
        </>
    );
};

const Card = styled.View`
    background-color: ${color.white};
    padding: 10px;
    margin-right: 10px;
    border-bottom-width: 1px;
    border-bottom-color: ${color.inputBorder};
`;

const CardContent = styled.View``;
const Heading = styled.Text`
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroyMedium};
    color: ${color.black};
`;
const Status = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyRegular};
    color: ${color.primary};
`;
const Type = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyRegular};
    color: ${color.primary};
`;

export default CalendarSchedule;
