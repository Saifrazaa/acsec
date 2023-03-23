import {useMutation, useQuery} from 'react-query';
import {Authclient, client, request} from '../utils/api';

const getAllBlogs = () => {
    return client.get('/life-at-ibex');
};

//Get All Blogs (Our Community)
export const useBlogsListing = ({onSuccess, onError}) => {
    return useQuery('blogs-listing', getAllBlogs, {
        retry: false,
        onSuccess,
        onError,
    });
};

//Get Specific Blogs

export const getSpecificBlogs = searchParams => {
    return client.get(`/life-at-ibex?${searchParams}`);
};

//Get Blogs Categories
const getAllCategories = () => {
    return client.get('/life-at-ibex/categories');
};

export const useBlogsCategories = ({onSuccess, onError}) => {
    return useQuery('blogs-categories', getAllCategories, {
        retry: false,
        onSuccess,
        onError,
    });
};
