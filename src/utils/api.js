import axios from 'react-native-axios';

export const baseUrl = 'https://www.talentibex.com/wp-json/talentibex/v1';

export const client = axios.create({
    baseURL: baseUrl,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: 'dTC2QNPsh3EcW115x2MZuveaU6B3LkD1JG2b3Uw7MKT6VtrYYHPWf59ez',
    },
});

export const setAuthToken = authToken => {
    if (authToken) {
        client.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
        delete client.defaults.headers.common['Authorization'];
    }
};

export const refreshToken = async (authToken, id) => {
    const newRes = await client
        .post('/token/refresh', {
            user_id: id,
            token: authToken,
        })
        .then(response => {
            if (response?.data?.data?.status === 200) {
                setAuthToken(response.data.data.details.token);
            }
        })
        .catch(err => {
            console.log('error', err);
        });
};
