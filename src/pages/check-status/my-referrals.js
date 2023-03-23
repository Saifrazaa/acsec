import React from 'react';
import Input from '../../shared-components/input/input';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const MyReferrals = ({referrerID, setReferrerID}) => {
    return (
        <Wrapper>
            <Input
                placeholder="Employee or Recruiter ID"
                label="Employee or Recruiter ID"
                value={referrerID}
                onValueChange={val => setReferrerID(val)}
            />
        </Wrapper>
    );
};
const Wrapper = styled.View`
    padding: 0 ${wp('5%')}px;
    width: ${wp('100%')}px;
`;

export default MyReferrals;
