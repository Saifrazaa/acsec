import 'react-native-gesture-handler';
import React, { useReducer, useEffect, useState } from 'react';
import { LogBox, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { configureFontAwesomePro } from 'react-native-fontawesome-pro';
import SplashScreen from 'react-native-splash-screen';

import { Auth } from './src/routes/main-routes';
import { UserContext, userReducer } from './src/context/user';
import { color } from './src/shared-components/helper';

const queryClient = new QueryClient();
const App = () => {
    configureFontAwesomePro();
    configureFontAwesomePro('regular');
    configureFontAwesomePro('light');
    configureFontAwesomePro('solid');
    const [user, dispatchUser] = useReducer(userReducer, []);
    const [getStarted, setGetStarted] = useState(false);
    const [loading, setLoading] = useState(false);

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

        setTimeout(() => {
            setLoading(false);
            SplashScreen.hide();
        }, 3000);

        // deleteGetStartedToken();
    }, []);


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
                        <UserContext.Provider value={{ user, dispatchUser }}>
                            <NavigationContainer>
                                <View
                                    style={{
                                        backgroundColor: color.app_bg,
                                        flex: 1,
                                    }}>
                                    <Auth isNew={getStarted} />
                                </View>
                            </NavigationContainer>
                        </UserContext.Provider>
                    </QueryClientProvider>
                </React.Fragment>
            )}
        </>
    );
};
LogBox.ignoreAllLogs();
export default App;
