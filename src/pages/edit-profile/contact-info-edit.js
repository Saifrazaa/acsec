import React, {useState} from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';

import Input from '../../shared-components/input/input';
import InputMask from '../../shared-components/input-mask/input-mask';
import {phoneMask} from '../../shared-components/helper';

const locations = [
    {
        label: 'Faisalabad',
        value: 'faisalabad',
    },
    {
        label: 'Gilgit',
        value: 'gilgit',
    },
    {
        label: 'Gujranwala',
        value: 'gujranwala',
    },
    {
        label: 'Islamabad',
        value: 'islamabad',
    },
    {
        label: 'Karachi',
        value: 'karachi',
    },
    {
        label: 'Lahore',
        value: 'lahore',
    },
    {
        label: 'Multan',
        value: 'multan',
    },
    {
        label: 'Muzaffarabad',
        value: 'muzaffarabad',
    },
    {
        label: 'Peshawar',
        value: 'peshawar',
    },
    {
        label: 'Quetta',
        value: 'quetta',
    },
    {
        label: 'Remote',
        value: 'remote',
    },
];

const ContactInfoEdit = () => {
    const [contactNmbr, setContactNmbr] = useState('');
    const [alternateNmbr, setAlternateNmbr] = useState('');
    const [location, setLocation] = useState('');

    return (
        <Wrapper>
            <Input
                placeholder="Enter email address"
                label="Email Address"
                keyboardType="email-address"
            />
            <InputMask
                label="Contact Number"
                placeholder="+92 ___ _______"
                value={contactNmbr}
                onValueChange={value => setContactNmbr(value)}
                keyboardType="phone-pad"
                prefix={['+', '9', '2']}
                mask={phoneMask}
            />
            <InputMask
                label="Alternate Contact Number"
                placeholder="+92 ___ _______"
                value={alternateNmbr}
                onValueChange={value => setAlternateNmbr(value)}
                keyboardType="phone-pad"
                prefix={['+', '9', '2']}
                mask={phoneMask}
            />
            <CustSelect
                label="Location"
                placeholder="Select Location"
                value={location}
                options={locations}
                onValueChange={val => setLocation(val)}
            />
        </Wrapper>
    );
};
const Wrapper = styled.View`
    width: ${wp('100%')}px;
    padding: 0 ${wp('5%')}px;
`;
export default ContactInfoEdit;
