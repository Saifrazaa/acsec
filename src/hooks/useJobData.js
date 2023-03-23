import {useMutation, useQuery} from 'react-query';
import {client} from '../utils/api';

// Get Jobs
const getJobs = () => {
    return client.get('/job/list');
};

export const useJobsListing = ({onSuccess, onError}) => {
    return useQuery('jobs-list', getJobs, {
        retry: false,
        onSuccess,
        onError,
    });
};

// Apply on Job
const applyOnJob = jobData => {
    return client.post('/job/apply-now', jobData);
};

export const useApplyJob = ({onSuccess, onError}) => {
    return useMutation(applyOnJob, {
        onSuccess,
        onError,
    });
};

//Get Specific Jobs
export const getSpecificJobs = searchBy => {
    return client.get(`/job/list?${searchBy}`);
};

//Get Default Settings
export const getDefaultSettings = () => {
    return client.get('/default-settings');
};

// Refer Someone
const referSomeone = jobData => {
    return client.post('/job/refer-now', jobData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const useReferSomeone = ({onSuccess, onError}) => {
    return useMutation(referSomeone, {
        onSuccess,
        onError,
    });
};

// Check Application Status
const checkStatus = jobData => {
    return client.post('/application/check-application', jobData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const useCheckStatus = ({onSuccess, onError}) => {
    return useMutation(checkStatus, {
        onSuccess,
        onError,
    });
};
