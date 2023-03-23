import moment from 'moment';
import React from 'react';
import Icon from 'react-native-fontawesome-pro';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';

import {color, fonts, sizes} from '../../shared-components/helper';

const JobCardApplied = ({
    title,
    location,
    depart,
    departBg,
    onPress,
    jobApplied,
    jobRefered,
    noShadow,
    stroke,
    jobStatus,
    appliedDate,
    referedSuccess,
    job,
}) => {
    return (
        <Card onPress={() => onPress()} noShadow={noShadow} stroke={stroke}>
            <CardTop>
                <JobInfo>
                    {(jobApplied || jobRefered) && (
                        <PreHeading>
                            {jobApplied ? 'Applied For' : 'Refered For'}
                        </PreHeading>
                    )}
                    <JobTitle>{title}</JobTitle>
                    {referedSuccess && (
                        <PreHeading>for {(job && job) || ''}</PreHeading>
                    )}
                </JobInfo>
                <Status>
                    <StatusWrapper>
                        <JobStatus>
                            {jobStatus ? jobStatus : 'Pending'}
                        </JobStatus>
                    </StatusWrapper>
                    {appliedDate && (
                        <AppliedDate>
                            {moment(appliedDate).format('MMM DD, YYYY')}
                        </AppliedDate>
                    )}
                </Status>
            </CardTop>
            {(location || depart) && (
                <CardBottom>
                    {location && (
                        <LocationWrapper>
                            <Icon
                                name="location-dot"
                                size={wp('3%')}
                                color={color.primary}
                            />
                            <Location>{location}</Location>
                        </LocationWrapper>
                    )}
                    {depart && (
                        <DepartPill departBg={departBg}>
                            <PillText>{depart}</PillText>
                        </DepartPill>
                    )}
                </CardBottom>
            )}
        </Card>
    );
};
const Card = styled.TouchableOpacity`
    width: 100%;
    background-color: ${color.white};
    margin-vertical: ${wp('2%')}px;
    padding: ${wp('5%')}px;
    justify-content: space-between;
    border-radius: ${wp('2%')}px;
    border-width: 1px;
    border-color: ${color.black}1A;
    ${props => {
        if (props.stroke) {
            return `
                border:1px solid;
                border-color:${color.primary};
            `;
        }
    }}
`;

const CardTop = styled.View`
    justify-content: space-between;
    flex-direction: row;
`;

const JobInfo = styled.View`
    max-width: 65%;
`;

const Status = styled.View`
    flex: 1 0;
    align-items: flex-end;
`;

const CardBottom = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${wp('3%')}px;
`;

const PreHeading = styled.Text`
    font-size: ${sizes.font13};
    font-family: ${fonts.GilroyRegular};
    color: ${color.gray_text};
`;

const JobTitle = styled.Text`
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroyBold};
    color: ${color.black};
    margin: ${wp('1.5%')}px 0;
    line-height: 20px;
`;
const DepartPill = styled.TouchableOpacity`
    padding: ${wp('2%')}px ${wp('4%')}px;
    border-radius: ${wp('5%')}px;
    background-color: ${props => (props.departBg ? props.departBg : color.sky)};
`;

const LocationWrapper = styled.View`
    flex-direction: row;
    align-items: center;
`;

const Location = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyRegular};
    color: ${color.black};
    margin-left: ${wp('1%')}px;
`;

const PillText = styled.Text`
    font-size: ${sizes.font12};
    color: ${color.white};
    font-family: ${fonts.GilroyMedium};
`;

const StatusWrapper = styled.View`
    flex-direction: row;
    align-items: center;
`;

const JobStatus = styled.Text`
    font-size: ${sizes.font13};
    font-family: ${fonts.GilroyMedium};
    text-align: right;
    color: ${color.black};
`;

const AppliedDate = styled.Text`
    font-size: ${sizes.font12};
    color: ${color.gray_text};
    font-family: ${fonts.GilroyRegular};
    text-align: right;
    margin-top: ${wp('1%')}px;
`;

export default JobCardApplied;
