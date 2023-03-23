import React from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {cnicMask, phoneMask} from '../../shared-components/helper';
import InputMask from '../../shared-components/input-mask/input-mask';
import Seperator from '../../components/seperator/seperator';

const MyApplications = ({
    cnicNumber,
    contactNumber,
    setCnicNumber,
    setContactNumber,
}) => {
    return (
        <Wrapper>
            <InputMask
                label="Contact Number"
                keyboardType="phone-pad"
                placeholder="+92 ___ _______"
                prefix={['+', '9', '2']}
                mask={phoneMask}
                value={contactNumber}
                onValueChange={value => [
                    setContactNumber(value),
                    setCnicNumber(''),
                ]}
            />
            <Seperator text="or" smallMargin />
            <InputMask
                label="CNIC Number"
                placeholder="xxxxx-xxxxxxx-x"
                value={cnicNumber}
                onValueChange={value => [
                    setCnicNumber(value),
                    setContactNumber(''),
                ]}
                keyboardType="phone-pad"
                mask={cnicMask}
            />
        </Wrapper>
    );
};
const Wrapper = styled.View`
    padding: 0 ${wp('5%')}px;
    width: ${wp('100%')}px;
    margin-bottom: ${wp('5%')}px;
`;

export default MyApplications;
