import {useMutation, useQuery} from 'react-query';
import {Authclient, client, request} from '../utils/api';

//Login User
const loginUser = uData => {
    return client.post('/login', uData);
};

export const useLogin = ({onSuccess, onError}) => {
    return useMutation(loginUser, {
        onSuccess,
        onError,
    });
};

//Register User
const registerUser = async uData => {
    return client.post('/user/registration', uData);
};

export const useRegister = ({onSuccess, onError}) => {
    return useMutation(registerUser, {
        onSuccess,
        onError,
    });
};

//Get All Cities
const getCities = () => {
    return client.get('/cities');
};

export const useCities = ({onSuccess, onError}) => {
    return useQuery('user-cities', getCities, {
        retry: false,
        onSuccess,
        onError,
    });
};

//OTP Verification
const VerifyUser = async uData => {
    return client.post('/user/otp-verification', uData);
};

export const useOTPVerify = ({onSuccess, onError}) => {
    return useMutation(VerifyUser, {
        onSuccess,
        onError,
    });
};

//Resend OTP
const ResendOtp = async uData => {
    return client.post('/user/resend-verification', uData);
};

export const useResendOTP = ({onSuccess, onError}) => {
    return useMutation(ResendOtp, {
        onSuccess,
        onError,
    });
};

export const usePassViaPhone = ({onSuccess, onError}) => {
    return useMutation(ForgotPasswordViaPhone, {
        onSuccess,
        onError,
    });
};

//Forgot Password Via Email
const ForgotPasswordViaEmail = async uData => {
    return client.post('/user/forget-password', uData);
};

export const usePassViaEmail = ({onSuccess, onError}) => {
    return useMutation(ForgotPasswordViaEmail, {
        onSuccess,
        onError,
    });
};

//Email Reset Password
const passwordReset = uData => {
    return client.post('/user/rest-password', uData);
};

export const usePasswordReset = ({onSuccess, onError}) => {
    return useMutation(passwordReset, {
        onSuccess,
        onError,
    });
};

//Delete User
const deleteUser = uData => {
    return client.post('/user/delete_user', uData);
};

export const useDelete = ({onSuccess, onError}) => {
    return useMutation(deleteUser, {
        onSuccess,
        onError,
    });
};

//Fetch User
export const fetchUser = () => {
    return client.get(`/user/profile?includes=all`);
};

//Get Employment types
const getEmpTypes = () => {
    return client.get('/user/employment_types');
};

export const useEmpTypes = ({onSuccess, onError}) => {
    return useQuery('emp-types', getEmpTypes, {
        retry: false,
        onSuccess,
        onError,
    });
};

//Upload Resume
const uploadResume = uData => {
    return client.post('/user/resume/update', uData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const useResumeUpload = ({onSuccess, onError}) => {
    return useMutation(uploadResume, {
        onSuccess,
        onError,
    });
};

//Delete Resume
const deleteResume = uData => {
    return client.post('/user/resume/delete', uData);
};

export const useResumeDelete = ({onSuccess, onError}) => {
    return useMutation(deleteResume, {
        onSuccess,
        onError,
    });
};

//Upload User Image
const uploadAvatar = uData => {
    return client.post('/user/avatar/update', uData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const useAvatarUpdate = ({onSuccess, onError}) => {
    return useMutation(uploadAvatar, {
        onSuccess,
        onError,
    });
};

const deleteAvatar = () => {
    return client.post('/user/avatar/delete');
};

export const useAvatarDelete = ({onSuccess, onError}) => {
    return useMutation(deleteAvatar, {
        onSuccess,
        onError,
    });
};

// Get all Applied jobs of a user
export const getAppliedJobs = () => {
    return client.get('/user/my_applications');
};

// Get My Referrals
export const getReferrals = () => {
    return client.get('/user/my-referrals');
};

// Add/Update Experience
const addUpdateExperience = uData => {
    return client.post('/user/experience/update', uData);
};

export const useExpUpdate = ({onSuccess, onError}) => {
    return useMutation(addUpdateExperience, {
        onSuccess,
        onError,
    });
};

// Delete Experience
const deleteExperience = uData => {
    return client.post('/user/experience/delete', uData);
};

export const useExpDelete = ({onSuccess, onError}) => {
    return useMutation(deleteExperience, {
        onSuccess,
        onError,
    });
};

// Add/Update Education
const addUpdateEducation = uData => {
    return client.post('/user/education/update', uData);
};

export const useEduUpdate = ({onSuccess, onError}) => {
    return useMutation(addUpdateEducation, {
        onSuccess,
        onError,
    });
};

// Delete Education
const deleteEducation = uData => {
    return client.post('/user/education/delete', uData);
};

export const useEduDelete = ({onSuccess, onError}) => {
    return useMutation(deleteEducation, {
        onSuccess,
        onError,
    });
};

// Delete Education
const editProfile = uData => {
    return client.post('/user/profile/update', uData);
};

export const useEditProfile = ({onSuccess, onError}) => {
    return useMutation(editProfile, {
        onSuccess,
        onError,
    });
};
