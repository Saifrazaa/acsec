import React, {useState} from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styled from 'styled-components';
import {View} from 'react-native';
import {useQuery} from 'react-query';

import JobCardApplied from '../../components/job-card/job-card-applied';
import {color, fonts, sizes} from '../../shared-components/helper';
import {getAppliedJobs} from '../../hooks/useUserData';
import JobCardPlaceHolder from '../../components/placeholders/job-card-placeholder';
import NotFound from '../../components/not-found/not-found';

const MyJobs = () => {
    const [myJobs, setMyJobs] = useState([]);

    const {isFetching: isJobsFetching} = useQuery(
        'get-applied-jobs',
        () => getAppliedJobs(),
        {
            retry: false,
            onSuccess: data => {
                setMyJobs(data?.data || []);
            },
            onError: err => {},
        },
    );

    return (
        <>
            <Wrapper>
                {(isJobsFetching &&
                    [...Array(3).keys()].map(i => {
                        return <JobCardPlaceHolder />;
                    })) || (
                    <View>
                        {(myJobs &&
                            myJobs.length > 0 &&
                            myJobs.map((item, index) => {
                                return (
                                    <JobCardApplied
                                        key={index}
                                        title={item.post_title}
                                        location={
                                            item?.meta_data[1]?.city[0]?.name
                                        }
                                        depart={
                                            item?.job[0]?.post_terms[0]?.name
                                        }
                                        appliedDate={item.created_at}
                                        departBg={
                                            item?.job[0]?.post_terms[0]
                                                ?.metadata?.select_color
                                        }
                                        jobStatus={item.application_status}
                                        jobApplied
                                        onPress={() => console.log('clicked')}
                                    />
                                );
                            })) || (
                            <NotFound
                                title="No Job Found"
                                para="You have not applied to any job."
                            />
                        )}
                    </View>
                )}
            </Wrapper>
        </>
    );
};

const Wrapper = styled.View`
    padding: 0 ${wp('5%')}px;
    width: ${wp('100%')}px;
    height: ${wp('100%')}%;
`;

export default MyJobs;
