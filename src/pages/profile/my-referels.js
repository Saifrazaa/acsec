import React, {useState} from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styled from 'styled-components';
import {View} from 'react-native';
import {useQuery} from 'react-query';

import {getReferrals} from '../../hooks/useUserData';
import JobCardApplied from '../../components/job-card/job-card-applied';
import JobCardPlaceHolder from '../../components/placeholders/job-card-placeholder';
import {color, fonts, sizes} from '../../shared-components/helper';
import NotFound from '../../components/not-found/not-found';

const MyReferels = () => {
    const [myReferrals, setMyReferrals] = useState([]);

    const {isFetching: isJobsFetching} = useQuery(
        'get-referrals',
        () => getReferrals(),
        {
            retry: false,
            onSuccess: data => {
                setMyReferrals(data?.data || []);
            },
            onError: err => {},
        },
    );

    return (
        <Wrapper>
            {(isJobsFetching &&
                [...Array(3).keys()].map(i => {
                    return <JobCardPlaceHolder />;
                })) || (
                <View>
                    {(myReferrals &&
                        myReferrals.length > 0 &&
                        myReferrals.map((item, index) => {
                            return (
                                <JobCardApplied
                                    key={index}
                                    title={item?.candidate_name}
                                    job={item?.post_title}
                                    location={item?.meta_data?.map(i =>
                                        i.meta_key === 'city_id'
                                            ? i.city[0].name
                                            : '',
                                    )}
                                    depart={item?.job[0]?.post_terms[0]?.name}
                                    appliedDate={item?.created_at}
                                    departBg={
                                        item?.job[0]?.post_terms[0]?.metadata
                                            ?.select_color
                                    }
                                    referedSuccess
                                    jobStatus={item?.application_status}
                                    onPress={() => console.log('clicked')}
                                />
                            );
                        })) || (
                        <NotFound
                            title="No Referal Found"
                            para="You have not referred anyone."
                        />
                    )}
                </View>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.View`
    padding: 0 ${wp('5%')}px;
    width: ${wp('100%')}px;
    height: ${wp('100%')}%;
`;

export default MyReferels;
