import React from 'react';
import Icon from 'react-native-fontawesome-pro';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styled from 'styled-components';

import {color, fonts, sizes} from '../../shared-components/helper';

const JobCard = ({
    title,
    locations,
    depart,
    departBg,
    onPress,
    jobApplying,
    jobRefering,
    noShadow,
    stroke,
    horizontalView,
    referedSuccess,
    job,
}) => {
    return (
        <Card
            onPress={() => onPress()}
            noShadow={noShadow}
            stroke={stroke}
            horizontalView={horizontalView}>
            <CardTop>
                {(jobApplying || jobRefering) && (
                    <PreHeading>
                        {jobApplying ? 'Applying for' : 'Referring for'}
                    </PreHeading>
                )}
                <JobTitle>{title}</JobTitle>
            </CardTop>
            <CardBottom>
                <LocationWrapper>
                    {locations && locations.length > 0 && (
                        <Icon
                            name="location-dot"
                            size={wp('3%')}
                            color={color.primary}
                        />
                    )}
                    {locations && locations.length > 0 && !horizontalView ? (
                        locations.map((item, index) => {
                            return (
                                <Location key={index}>
                                    {item}
                                    {index !== locations.length - 1 && ', '}
                                </Location>
                            );
                        })
                    ) : (
                        <>
                            <Location>{locations[0]}</Location>
                            {locations.length > 1 && (
                                <MoreLocation>
                                    , +{locations.length - 1}
                                </MoreLocation>
                            )}
                        </>
                    )}
                </LocationWrapper>
                <DepartPill departBg={departBg}>
                    <PillText>{depart}</PillText>
                </DepartPill>
            </CardBottom>
        </Card>
    );
};
const Card = styled.TouchableOpacity`
    width: 100%;
    background-color: ${color.white};
    margin-vertical: ${wp('2%')}px;
    padding: ${wp('4%')}px;
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
        if (props.horizontalView) {
            return `
                height:${hp('14%')}px;
                padding-bottom:${wp('2%')}px;
            `;
        }
    }}
`;

const CardTop = styled.View``;

const CardBottom = styled.View`
    flex: 1 0;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${wp('4%')}px;
`;

const PreHeading = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyRegular};
    color: ${color.gray_text};
`;

const JobTitle = styled.Text`
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroyBold};
    color: ${color.black};
    margin: ${wp('1.5%')}px 0;
`;
const DepartPill = styled.TouchableOpacity`
    padding: ${wp('2%')}px ${wp('4%')}px;
    border-radius: ${wp('5%')}px;
    background-color: ${props => (props.departBg ? props.departBg : color.sky)};
`;

const LocationWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    padding-right: ${wp('2%')}px;
    flex: 1 0;
`;

const Location = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyRegular};
    margin-left: ${wp('1%')}px;
    color: ${color.black};
`;

const PillText = styled.Text`
    font-size: ${sizes.font12};
    color: ${color.white};
    font-family: ${fonts.GilroyMedium};
`;

const MoreLocation = styled.Text`
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroySemiBold};
    color: ${color.black};
`;

export default JobCard;
