import AsyncStorage from '@react-native-async-storage/async-storage';

export const setUserToken = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('@authToken', jsonValue);
    } catch (e) {
        console.log(e);
    }
};

export const setRegisterToken = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('@firstLogin', jsonValue);
    } catch (e) {
        console.log(e);
    }
};

export const getUserToken = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@authToken');
        return jsonValue !== null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e);
    }
};

export const deleteUserToken = async () => {
    try {
        await AsyncStorage.removeItem('@authToken');
    } catch (e) {
        console.log(e);
    }
};

export const deleteRegisterToken = async () => {
    try {
        await AsyncStorage.removeItem('@firstLogin');
    } catch (e) {
        console.log(e);
    }
};

export const logout = () => {
    deleteUserToken();
};

export const setBiometricToken = async (email, password) => {
    try {
        var items = [email, password];
        const jsonValue = JSON.stringify(items);
        await AsyncStorage.setItem('@biometricToken', jsonValue);
    } catch (e) {
        console.log(e);
    }
};

export const getBiometricToken = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@biometricToken');
        return jsonValue !== null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e);
    }
};

export const deleteBiometricToken = async () => {
    try {
        await AsyncStorage.removeItem('@biometricToken');
    } catch (e) {
        console.log(e);
    }
};

export const setGetStartedToken = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('@getStartedToken', jsonValue);
    } catch (e) {
        console.log(e);
    }
};

export const deleteGetStartedToken = async () => {
    try {
        await AsyncStorage.removeItem('@getStartedToken');
    } catch (e) {
        console.log(e);
    }
};
