import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Moment from 'moment';
import {Dimensions, Linking} from 'react-native';
// import pinch from 'react-native-pinch';

Moment.locale('en');

export const deviceWidth = Dimensions.get('window').width;
export const mobileScreen = deviceWidth < 600;
// C O L O R S
export const color = {
    app_bg: '#F9F9F9',
    primary: 'grey',
    black: '#131313',
    headingColor: '#292D32',
    white: '#ffffff',
    lightest_gray: '#F8F8F8',
    gray: '#77838F',
    inputBorder: '#D6D6D6',
    light_grey: '#7E7E7E',
    sky: '#17AFE5',
    green: '#46c756',
    gray_text: '#646464',
    light_grey_bg: '#E5E5E5',
    danger: '#E42B2B',
};

//F O N T    F A M I L Y
export const fonts = {
    AxiformaLight: 'Axiforma-Light',
    AxiformaRegular: 'Axiforma-Regular',
    AxiformaMedium: 'Axiforma-Medium',
    AxiformaBold: 'Axiforma-Bold',
    GilroyRegular: 'Gilroy-Regular',
    GilroyMedium: 'Gilroy-Medium',
    GilroySemiBold: 'Gilroy-SemiBold',
    GilroyBold: 'Gilroy-Bold',
    GilroyExtraBold: 'Gilroy-ExtraBold',
};

//F O N T    S I Z E S
export const sizes = {
    font11: `${wp('2%')}px`,
    font12: `${wp('2.5%')}px`,
    font13: `${wp('3%')}px`,
    font14: `${wp('3.5%')}px`,
    font16: `${wp('4%')}px`,
    font18: `${wp('4.5%')}px`,
    btnSize: `${wp('4%')}px;`,
    font20: `${wp('5%')}px`,
    font24: `${wp('6.3%')}px`,
    font30: `${wp('7.3%')}px`,
    font38: `${wp('9%')}px`,
};

//I C O N    S I Z E S
export const Iconsizes = {
    size10: wp('2%'),
    size12: wp('2.5%'),
    size14: wp('3.5%'),
    size16: wp('4%'),
    size18: wp('4.5%'),
    size20: wp('5%'),
    size24: wp('6.3%'),
    size30: wp('7.3%'),
    size38: wp('9%'),
    size40: wp('11%'),
};

export const boxShadow = {
    shadowColor: color.black,
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
};

export const getDate = dateTime => {
    return Moment(dateTime).format('LL');
};
export const getTime = time => {
    return Moment.utc(time * 1000).format('mm:ss');
};

export const handlePhoneNumber = number => {
    if (number !== undefined && number !== '') {
        while (number.charAt(0) !== '3') {
            number = number.substring(1);
        }
        return '+92' + number;
    }
};

export const handleExternelLink = url => {
    Linking.canOpenURL(url).then(supported => {
        if (supported) {
            Linking.openURL(url);
        }
    });
};

export const capitalizeFirstLetter = value => {
    return value?.charAt(0).toUpperCase() + value?.slice(1);
};

export const handleMimeType = val => {
    if (
        val === 'application/pdf' ||
        val === 'application/msword' ||
        val ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        return true;
    } else {
        return false;
    }
};

export const handleFileType = mimetype => {
    if (mimetype === 'application/pdf') {
        return '.pdf';
    } else if (mimetype === 'application/msword') {
        return '.doc';
    } else {
        return '.docx';
    }
};

export const handleJobStatus = status => {
    if (status === '0') {
        return 'In Process';
    } else {
        return status;
    }
};

export const cnicMask = [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
];

export const phoneMask = [
    '+',
    '9',
    '2',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
];

export const apiUrl = 'https://www.talentibex.com';

export const token = 'b2cc0dac00380a6bdd1ac090bc1e60fb';

// export const pinchFetch = (url, data) => {
//   return pinch
//     .fetch(`${url}?${new URLSearchParams(data).toString()}`, {
//       method: 'POST',
//       sslPinning: {
//         cert: 'talentibexcert',
//       },
//     })
//     .then(response => response.json())
//     .then(responseData => {
//       return responseData;
//     })
//     .catch(error => console.warn(error));
// };
