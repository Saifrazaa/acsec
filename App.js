import 'react-native-gesture-handler';
import React, {useReducer, useEffect, useState} from 'react';
import {LogBox, StatusBar, View, SafeAreaView, BackHandler} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {QueryClient, QueryClientProvider} from 'react-query';
import {configureFontAwesomePro} from 'react-native-fontawesome-pro';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';

import {CustomDrawer, Auth} from './src/routes/main-routes';
import {UserContext, userReducer} from './src/context/user';
import {refreshToken, setAuthToken} from './src/utils/api';
import {deleteGetStartedToken} from './src/utils/token-manager';
import {color} from './src/shared-components/helper';
import AlertModal from './src/shared-components/popups/alertModal';

const queryClient = new QueryClient();
const App = () => {
    configureFontAwesomePro();
    configureFontAwesomePro('regular');
    configureFontAwesomePro('light');
    configureFontAwesomePro('solid');
    const [user, dispatchUser] = useReducer(userReducer, []);
    const [getStarted, setGetStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [netState, setNetState] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const getUserToken = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@authToken');
            const res = jsonValue != null ? JSON.parse(jsonValue) : null;
            if (res && Object.keys(res).length !== 0) {
                dispatchUser({
                    type: 'SET_USER',
                    user: {
                        ...res.userData,
                        token: res.token,
                        profile: {
                            ...res.userData,
                        },
                        loggedIn: true,
                    },
                });
                setAuthToken(res.token);
                refreshToken(res.token, res.userData.id);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const getStartedToken = async () => {
        setLoading(true);
        try {
            const jsonValue = await AsyncStorage.getItem('@getStartedToken');
            const res = jsonValue != null ? JSON.parse(jsonValue) : null;
            if (res && Object.keys(res).length !== 0) {
                setGetStarted(false);
            } else {
                setGetStarted(true);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getStartedToken();
        getUserToken();

        NetInfo.addEventListener(state => {
            setNetState(state.isInternetReachable);
            state.isInternetReachable
                ? setModalVisible(false)
                : setModalVisible(true);
        });

        setTimeout(() => {
            setLoading(false);
            SplashScreen.hide();
        }, 3000);

        // deleteGetStartedToken();
    }, []);

    const HandleInternet = () => {
        if (netState) {
            setModalVisible(false);
        } else {
            BackHandler.exitApp();
        }
    };

    return (
        <>
            {!loading && (
                <React.Fragment>
                    <StatusBar
                        style="light"
                        translucent={true}
                        backgroundColor={'transparent'}
                    />
                    <QueryClientProvider client={queryClient}>
                        <UserContext.Provider value={{user, dispatchUser}}>
                            <NavigationContainer>
                                <View
                                    style={{
                                        backgroundColor: color.app_bg,
                                        flex: 1,
                                    }}>
                                    {user['loggedIn'] ? (
                                        <CustomDrawer />
                                    ) : (
                                        <Auth isNew={getStarted} />
                                    )}
                                </View>
                            </NavigationContainer>
                        </UserContext.Provider>
                    </QueryClientProvider>
                </React.Fragment>
            )}
            {netState === false && modalVisible && (
                <SafeAreaView>
                    <AlertModal
                        isVisible={modalVisible}
                        title={
                            netState
                                ? 'Internet connection restored'
                                : 'Internet connection error'
                        }
                        text={
                            netState
                                ? 'Your internet has been restored. Press Continue to move forward.'
                                : 'No internet connection found on this device, please check your internet connection and try again.'
                        }
                        btnText={netState ? 'Continue' : 'Exit'}
                        onClickBtn={HandleInternet}
                    />
                </SafeAreaView>
            )}
        </>
    );
};
LogBox.ignoreAllLogs();
export default App;
