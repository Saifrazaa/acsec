import React, {useContext, useEffect, useState} from 'react';
import PieChart from 'react-native-pie-chart';
import database from '@react-native-firebase/database';

import Layout from '../../components/layout';
import {UserContext} from '../../context/user';
import styled from 'styled-components';
import {color, fonts, sizes} from '../../shared-components/helper';

const headerOptions = {
    drawerBtn: true,
    heading: 'Activity Chart',
    subHeading: 'You can check your activities in a graphical view.',
};

const Graph = () => {
    const [completed, setCompleted] = useState(0);
    const [compPerc, setCompPerc] = useState(0);
    const [inComPerc, setInComPerc] = useState(0);
    const [inCompleted, setInCompleted] = useState(10);
    const {user} = useContext(UserContext);

    const widthAndHeight = 250;
    const series = [completed, inCompleted];
    const sliceColor = ['#FFC154', '#47B39C'];

    useEffect(() => {
        database()
            .ref(`activities/${user.phone_no}`)
            .once('value')
            .then(snapshot => {
                var comData = 0;
                var inComData = 0;
                const arr = [];
                snapshot.forEach(activity => {
                    arr.push(activity);
                    if (activity.val().completed) {
                        comData += 1;
                    } else {
                        inComData += 1;
                    }
                });
                setCompPerc(((comData * 100) / arr.length).toFixed(2));
                setInComPerc(((inComData * 100) / arr.length).toFixed(2));
                setCompleted(comData);
                setInCompleted(inComData);
            });
    }, []);

    return (
        <>
            <Layout withHeader headerOptions={headerOptions}>
                <Wrapper>
                    <StatusWrapper>
                        <StatusWrap>
                            <Circle bgColor={'#FFC154'} />
                            <Label>Completed ({compPerc + '%'})</Label>
                        </StatusWrap>
                        <StatusWrap>
                            <Circle bgColor={'#47B39C'} />
                            <Label>In-Complete ({inComPerc + '%'})</Label>
                        </StatusWrap>
                    </StatusWrapper>
                    <PieChart
                        widthAndHeight={widthAndHeight}
                        series={series}
                        sliceColor={sliceColor}
                    />
                </Wrapper>
            </Layout>
        </>
    );
};

const Wrapper = styled.View`
    margin-top: 30px;
    align-items: center;
    width: 100%;
`;

const StatusWrapper = styled.View`
    justify-content: space-between;
    margin-bottom: 50px;
    width: 100%;
    padding: 0px 50px;
`;
const StatusWrap = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
`;
const Circle = styled.View`
    height: 12px;
    width: 12px;
    border-radius: 20px;
    background-color: ${props => props.bgColor};
    margin-right: 10px;
`;
const Label = styled.Text`
    font-size: ${sizes.font18};
    font-family: ${fonts.GilroySemiBold};
    color: ${color.black};
`;

export default Graph;
