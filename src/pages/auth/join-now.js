import React, {useState} from 'react';
import * as Animatable from 'react-native-animatable';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {useRegister} from '../../hooks/useUserData';
import AlertModal from '../../shared-components/popups/alertModal';
import {Loader, LoaderWrapper} from '../../shared-components/loader';
import {
    RegisterStep1,
    RegisterStep2,
    RegisterStep3,
} from '../../components/registration-steps';

const userObj = {
    full_name: '',
    gender: '',
    dob: '',
    cnic: '',
    city_id: '',
    education: '',
    email: '',
    phone: '',
    alternate_phone: '',
    is_ibex_employee: '',
    employee_id: '',
    employee_email: '',
    password: '',
    confirm_password: '',
};

const JoinNow = ({navigation}) => {
    const [successModal, setSuccessModal] = useState(false);
    const [userData, setUserData] = useState(userObj);
    const [activeIndex, setActiveIndex] = useState(0);
    const [errModal, setErrModal] = useState(false);
    const [errMsgs, setErrMsgs] = useState([]);

    const handleNextSlide = () => {
        if (activeIndex < 2) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const handleBackSlide = () => {
        setActiveIndex(activeIndex - 1);
    };

    const {mutate: Register, isLoading} = useRegister({
        onSuccess: data => {
            if (data && data.status === 200) {
                setSuccessModal(true);
                setUserData(userObj);
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            if (response?.data?.data?.status === 400) {
                var arr = [];
                var errors = response?.data?.data?.details;
                for (var keys in errors) {
                    arr.push(errors[keys]);
                }
                setErrMsgs(arr);
            } else {
                setErrMsgs([response?.data?.message]);
            }
        },
    });

    const onRegister = async v => {
        setUserData(v);
        await Register(v);
    };
    const FormSteps = [
        {
            step: 1,
            component: (
                <RegisterStep1
                    handleNextSlide={handleNextSlide}
                    setUserData={values => setUserData(values)}
                    userData={userData}
                    activeIndex={activeIndex}
                />
            ),
        },
        {
            step: 2,
            component: (
                <RegisterStep2
                    handleNextSlide={handleNextSlide}
                    handleBackSlide={handleBackSlide}
                    setUserData={values => setUserData(values)}
                    userData={userData}
                    activeIndex={activeIndex}
                />
            ),
        },
        {
            step: 3,
            component: (
                <RegisterStep3
                    handleBackSlide={handleBackSlide}
                    userData={userData}
                    activeIndex={activeIndex}
                    onRegister={onRegister}
                />
            ),
        },
    ];

    return (
        <>
            {FormSteps &&
                FormSteps.length > 0 &&
                FormSteps.map((item, index) => {
                    if (activeIndex === index) {
                        return (
                            <Animatable.View
                                key={index}
                                easing="ease-in-out"
                                duration={300}
                                style={{flex: 1}}>
                                {item.component}
                            </Animatable.View>
                        );
                    }
                })}
            <AlertModal
                title="Congratulations"
                text={`You have successfully registered to talentibex`}
                btnText="Continue Login"
                isVisible={successModal}
                onClickBtn={() => {
                    navigation.navigate('Login');
                    handleNextSlide();
                }}
                onClose={() => setSuccessModal(false)}
            />
            <AlertModal
                title="Request Failed"
                text={'There are some errors in the request.'}
                btnText="Retry"
                errModal
                errMsgs={errMsgs}
                isVisible={errModal}
                onClickBtn={() => {
                    setErrModal(false);
                }}
            />
            {isLoading && (
                <LoaderWrapper>
                    <Loader size={wp('12%')} />
                </LoaderWrapper>
            )}
        </>
    );
};

export default JoinNow;
