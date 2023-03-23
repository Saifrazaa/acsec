import {useMutation, useQuery} from 'react-query';
import {client} from '../utils/api';

// Get Programs
const getPrograms = () => {
    return client.get('/program');
};

// Get All Programs
export const useProgramListing = ({onSuccess, onError}) => {
    return useQuery('programs-list', getPrograms, {
        retry: false,
        onSuccess,
        onError,
    });
};

//Get Specific Jobs

export const getSpecificProgram = searchBy => {
    return client.get(`/program?${searchBy}`);
};
