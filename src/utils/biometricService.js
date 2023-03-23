import {Platform} from 'react-native';
import TouchID from 'react-native-touch-id';

export const checkBiometricSupportednEnrolled = async () => {
    const optionalConfigObject = {
        title: 'Authentication Required',
        imageColor: '#e00606',
        imageErrorColor: '#ff0000',
        sensorDescription: `Scan your ${
            Platform.OS == 'ios' ? 'Touch/Face ID' : 'fingerprint'
        }`,
        sensorErrorDescription: 'Failed',
        cancelText: 'Cancel',
        fallbackLabel: 'Show Passcode',
        unifiedErrors: false,
        passcodeFallback: false,
    };
    return new Promise((resolve, reject) => {
        //isSupported returns both cases 1. if supported 2. Is enabled/configured/enrolled
        TouchID.isSupported(optionalConfigObject)
            .then(biometryType => {
                if (biometryType && biometryType != 'FaceID') {
                    resolve(true);
                } else {
                    let fingerprintLableForOS =
                        Platform.OS == 'ios' ? 'Touch ID' : 'Fingerprint';
                    reject(
                        fingerprintLableForOS +
                            ' is not available on this device',
                    );
                }
            })
            .catch(error => {
                let errorCode = Platform.OS == 'ios' ? error.name : error.code;
                if (
                    errorCode === 'LAErrorTouchIDNotEnrolled' ||
                    errorCode === 'NOT_AVAILABLE' ||
                    errorCode === 'NOT_ENROLLED'
                ) {
                    let fingerprintLableForOS =
                        Platform.OS == 'ios' ? 'Touch ID' : 'Fingerprint';
                    resolve(
                        fingerprintLableForOS +
                            ' has no enrolled fingers. Please go to settings and enable ' +
                            fingerprintLableForOS +
                            ' on this device.',
                    );
                } else {
                    reject(
                        Platform.OS == 'ios'
                            ? error.message
                            : translations.t(error.code),
                    );
                }
            });
    });
};

export const authenticateFingerPrint = () => {
    return new Promise((resolve, reject) => {
        let fingerprintLableForOS =
            Platform.OS == 'ios' ? 'Touch ID' : 'Fingerprint';

        TouchID.authenticate(
            'Login to iNovo e-store using ' + fingerprintLableForOS,
        )
            .then(success => {
                resolve(success);
            })
            .catch(error => {
                reject(error);
            });
    });
};
