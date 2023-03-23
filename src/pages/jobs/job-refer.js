import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-fontawesome-pro';
import {useRoute} from '@react-navigation/native';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {useFormik} from 'formik';
import * as yup from 'yup';
import DocumentPicker from 'react-native-document-picker';
import {useQuery} from 'react-query';

import JobCard from '../../components/job-card/job-card-applying';
import Layout from '../../components/layout';
import FormButton from '../../shared-components/button/form-button';
import {
    cnicMask,
    color,
    fonts,
    phoneMask,
    sizes,
    handleMimeType,
    Iconsizes,
} from '../../shared-components/helper';
import InputMask from '../../shared-components/input-mask/input-mask';
import Input from '../../shared-components/input/input';
import AlertModal from '../../shared-components/popups/alertModal';
import {useReferSomeone} from '../../hooks/useJobData';
import {useCities} from '../../hooks/useUserData';
import ErrorText from '../../shared-components/error-text/error-text';
import {fetchUser} from '../../hooks/useUserData';
import {Loader, LoaderWrapper} from '../../shared-components/loader';

const applyJobSchema = yup.object({
    candidate_full_name: yup
        .string()
        .required('Full Name is required')
        .matches(/^([a-zA-Z\s])+$/, 'The name format is invalid'),
    candidate_phone: yup
        .string()
        .required('Contact number is required')
        .min(15, 'Invalid contact number'),
    candidate_email: yup
        .string()
        .required('Email address is required')
        .email('Please enter valid email')
        .matches(
            /^[a-zA-Z0-9@_.-]*$/,
            'Sorry, only letters (a-z), number (0-9), and periods (.) are allowed',
        ),
    candidate_location: yup
        .number()
        .required('Please select candidate city')
        .nullable(),
    candidate_cnic: yup.string().min(14, 'Please enter valid CNIC'),
    candidate_resume: yup.object().required('Resume is Required').nullable(),
    job_location: yup
        .string()
        .required('Please Select job location')
        .nullable(),
    program_category_id: yup.string().required('Please select program type'),
    summary: yup.string().required('Please let us know about candidate'),
});

const JobRefer = ({navigation}) => {
    const [locations, setLocations] = useState([]);
    const [jobLocations, setJobLocations] = useState('');
    const [successModal, setSuccessModal] = useState(false);
    const [resumeName, setResumeName] = useState(null);
    const [errModal, setErrModal] = useState(false);
    const [errMsgs, setErrMsgs] = useState('');
    const [user, setUser] = useState({});

    const route = useRoute();
    const job = route.params.job_meta;

    const headerOptions = {
        backBtn: true,
        backBtnAction: {
            screen: 'JobsListing',
        },
    };

    const {isFetching: isLocationFetching} = useCities({
        onSuccess: data => {
            const cities = data?.data?.data?.details.map(key => {
                return {
                    label: key.name,
                    value: key.term_id,
                };
            });
            setLocations(cities);
        },
        onError: err => {
            console.log('Error', err);
        },
    });

    const formik = useFormik({
        initialValues: {
            candidate_full_name: '',
            candidate_phone: '',
            candidate_email: '',
            candidate_location: '',
            candidate_cnic: '',
            candidate_resume: '',
            job_location: '',
            summary: '',
        },
        validationSchema: applyJobSchema,
        onSubmit: values => {
            onReferSomeone(values);
        },
    });

    const handleDocumentSelection = async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                copyTo: 'documentDirectory',
            });
            if (handleMimeType(response[0].type)) {
                var resumeName = '';
                if (response[0].name) {
                    resumeName = response[0].name;
                } else {
                    const splitArr = response[0].uri.split('/');
                    resumeName =
                        splitArr[splitArr.length - 1] +
                        handleFileType(response[0].type);
                }
                const data = {
                    type: response[0].type,
                    name: resumeName,
                    uri: response[0].uri,
                };
                formik.setFieldValue('candidate_resume', data);
                setResumeName(resumeName);
            } else {
                setErrModal(true);
                setErrMsgs(
                    'Please select a valid file type (.pdf, .doc, .docx)',
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const {mutate: ReferSomeone, isLoading} = useReferSomeone({
        onSuccess: data => {
            if (data?.data?.data?.status === 200) {
                setSuccessModal(true);
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            setErrMsgs(response?.data?.message);
        },
    });

    const onReferSomeone = async v => {
        const data = new FormData();
        data.append('job_id', job?.job_id);
        data.append('form_name', 'refer_now');
        data.append('is_ibex_employee', user?.is_ibex_employee);
        data.append('employee_full_name', user?.full_name);
        data.append('employee_id', user?.employee_id);
        data.append('referrer_cnic', user?.cnic);
        data.append('referrer_full_name', user?.full_name);
        data.append('referrer_phone', user?.phone);
        data.append('referrer_email', user?.email);
        data.append('referrer_city_id', user?.city_id);
        data.append('resume', v.candidate_resume);
        data.append('cnic', v.candidate_cnic);
        data.append('full_name', v.candidate_full_name);
        data.append('phone', v.candidate_phone);
        data.append('email', v.candidate_email);
        data.append('city_id', v.job_location);
        data.append('program_category_id', v.program_category_id);
        data.append('summary', v.summary);

        await ReferSomeone(data);
    };

    const {isFetching} = useQuery('get-profile', () => fetchUser(), {
        retry: false,
        onSuccess: data => {
            if (data?.status === 200) {
                const userData = data?.data?.data?.details?.info;
                setUser(userData);
            }
        },
        onError: err => {
            console.log('Error', err?.response?.data?.data?.message);
        },
    });

    const recommendedProgram = [
        {
            label: 'Domestic',
            value: '59',
        },
        {
            label: 'International',
            value: '58',
        },
    ];

    useEffect(() => {
        const arr = [];
        job.locations.map((item, index) => {
            arr.push({
                label: item.name,
                value: item.term_id,
            });
        });
        setJobLocations(arr);
    }, [job]);

    return (
        <>
            <KeyboardAvoidingView
                behavior="padding"
                style={{flexGrow: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -400}>
                <Layout
                    noPadding
                    bgColor={color.lightest_gray}
                    withHeader
                    headerOptions={headerOptions}>
                    <ReferFormWrapper>
                        <JobCard
                            jobRefering
                            title={job?.title}
                            locations={job?.locations.map(i => i.name)}
                            depart={job?.depart}
                            departBg={job?.departBg}
                            onPress={() => navigation.goBack()}
                            stroke
                        />
                        <ReferForm>
                            <Input
                                placeholder="Enter full name"
                                label="Candidate Full Name"
                                value={formik.values.candidate_full_name}
                                onValueChange={value =>
                                    formik.setFieldValue(
                                        'candidate_full_name',
                                        value,
                                    )
                                }
                                errorText={
                                    formik.touched.candidate_full_name &&
                                    formik.errors.candidate_full_name
                                }
                            />
                            <InputMask
                                label="Candidate Contact Number"
                                placeholder="+92 ___ _______"
                                value={formik.values.candidate_phone}
                                onValueChange={value =>
                                    formik.setFieldValue(
                                        'candidate_phone',
                                        value,
                                    )
                                }
                                keyboardType="phone-pad"
                                prefix={['+', '9', '2']}
                                mask={phoneMask}
                                errorText={
                                    formik.touched.candidate_phone &&
                                    formik.errors.candidate_phone
                                }
                            />
                            <Input
                                placeholder="Enter email address"
                                label="Candidate Email"
                                keyboardType="email-address"
                                value={formik.values.candidate_email}
                                onValueChange={value =>
                                    formik.setFieldValue(
                                        'candidate_email',
                                        value,
                                    )
                                }
                                errorText={
                                    formik.touched.candidate_email &&
                                    formik.errors.candidate_email
                                }
                            />
                            <CustSelect
                                label="Candidate Location"
                                placeholder="Select Location"
                                value={formik.values.candidate_location}
                                options={locations}
                                onValueChange={value =>
                                    formik.setFieldValue(
                                        'candidate_location',
                                        value,
                                    )
                                }
                                errorText={
                                    formik.touched.candidate_location &&
                                    formik.errors.candidate_location
                                }
                                isLoading={isLocationFetching}
                            />
                            <InputMask
                                label="Candidate CNIC"
                                placeholder="xxxxx-xxxxxxx-x"
                                value={formik.values.candidate_cnic}
                                onValueChange={value =>
                                    formik.setFieldValue(
                                        'candidate_cnic',
                                        value,
                                    )
                                }
                                keyboardType="phone-pad"
                                mask={cnicMask}
                                errorText={
                                    formik.touched.candidate_cnic &&
                                    formik.errors.candidate_cnic
                                }
                            />
                            {(formik.values.candidate_resume &&
                                formik.values.candidate_resume !== '' && (
                                    <NewUploadedResume>
                                        <ResumeIcon>
                                            <Icon
                                                name="file"
                                                color={color.white}
                                                size={Iconsizes.size20}
                                            />
                                        </ResumeIcon>
                                        <ResumeInfo>
                                            <ResumeTitileWrap>
                                                <ResumeTitle numberOfLines={1}>
                                                    {resumeName}
                                                </ResumeTitle>
                                            </ResumeTitileWrap>
                                        </ResumeInfo>
                                        <ResumeActions>
                                            <ActionBtn
                                                onPress={() => [
                                                    setResumeName(null),
                                                    formik.setFieldValue(
                                                        'candidate_resume',
                                                        '',
                                                    ),
                                                ]}>
                                                <Icon
                                                    name="trash"
                                                    type="light"
                                                    color={color.danger}
                                                    size={Iconsizes.size18}
                                                />
                                            </ActionBtn>
                                        </ResumeActions>
                                    </NewUploadedResume>
                                )) || (
                                <ResumeUploadWrapper>
                                    <UploadResumeBtn
                                        onPress={() =>
                                            handleDocumentSelection()
                                        }>
                                        <Icon
                                            name="cloud-arrow-up"
                                            color={color.primary}
                                            size={wp('4.5%')}
                                        />
                                        <UploadResumeTxt>
                                            Upload Resume
                                        </UploadResumeTxt>
                                    </UploadResumeBtn>
                                    {formik.touched.candidate_resume &&
                                        formik.errors.candidate_resume && (
                                            <ErrorWrapper>
                                                <ErrorText
                                                    text={
                                                        formik.errors
                                                            .candidate_resume
                                                    }
                                                />
                                            </ErrorWrapper>
                                        )}
                                </ResumeUploadWrapper>
                            )}

                            <CustSelect
                                label="Job Location"
                                placeholder="Select Location"
                                value={formik.values.job_location}
                                options={jobLocations}
                                onValueChange={value =>
                                    formik.setFieldValue('job_location', value)
                                }
                                errorText={
                                    formik.touched.job_location &&
                                    formik.errors.job_location
                                }
                            />
                            <CustSelect
                                label="Recommended Program"
                                placeholder="Select Program"
                                value={formik.values.program_category_id}
                                options={recommendedProgram}
                                onValueChange={value =>
                                    formik.setFieldValue(
                                        'program_category_id',
                                        value,
                                    )
                                }
                                errorText={
                                    formik.touched.program_category_id &&
                                    formik.errors.program_category_id
                                }
                                isLoading={isLocationFetching}
                            />
                            <Input
                                label="Let us know about Candidate (Optional)"
                                placeholder="Write something..."
                                multiline
                                value={formik.values.summary}
                                onValueChange={value =>
                                    formik.setFieldValue('summary', value)
                                }
                                noflines={5}
                                errorText={
                                    formik.touched.summary &&
                                    formik.errors.summary
                                }
                            />
                        </ReferForm>
                    </ReferFormWrapper>
                </Layout>
                <Layout noScroll footer bgColor={color.white}>
                    <FooterBtnWrap>
                        <FormButton
                            btnText="Refer"
                            btnWidth="100%"
                            onClick={formik.handleSubmit}
                        />
                    </FooterBtnWrap>
                </Layout>
            </KeyboardAvoidingView>

            <AlertModal
                title="Thank You"
                text={`Your Refer request has been submitted successfully.`}
                btnText="Continue Exploring"
                referModal
                referDetail={{
                    name: formik.values.candidate_full_name,
                    title: job?.title,
                    depart: job?.depart,
                    departBg: job?.departBg,
                    locations:
                        (successModal &&
                            jobLocations?.filter(
                                i => i.value === formik.values.job_location,
                            )) ||
                        [],
                }}
                isVisible={successModal}
                onClose={() => setSuccessModal(false)}
                onClickBtn={() => [
                    setSuccessModal(false),
                    navigation.navigate('JobsListing'),
                ]}
            />

            <AlertModal
                title="Request Failed"
                text={errMsgs}
                errModal
                btnText="Retry"
                isVisible={errModal}
                onClose={() => setErrModal(false)}
                onClickBtn={() => [setErrModal(false)]}
            />

            {(isFetching || isLoading) && (
                <LoaderWrapper>
                    <Loader size={wp('12%')} />
                </LoaderWrapper>
            )}
        </>
    );
};

const SelectedResume = styled.View``;

const FooterBtnWrap = styled.View`
    flex-direction: row;
    height: auto;
    justify-content: space-between;
`;

const ReferFormWrapper = styled.View`
    padding: 0 ${wp('7%')}px;
    margin-top: ${wp('-27%')}px;
`;

const ReferForm = styled.View`
    margin-top: ${wp('7%')}px;
`;

const ResumeUploadWrapper = styled.View`
    margin-bottom: ${wp('5%')}px;
`;

const UploadResumeBtn = styled.TouchableOpacity`
    padding: ${wp('8%')}px ${wp('5%')}px;
    background-color: ${color.white};
    border: 2px dotted;
    border-color: ${color.primary};
    border-radius: ${wp('2%')}px;
    flex-direction: row;
    margin-bottom: ${wp('2%')}px;
`;

const UploadResumeTxt = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyMedium};
    color: ${color.black};
    margin-left: ${wp('3%')}px;
`;

const ErrorWrapper = styled.View``;

const NewUploadedResume = styled.View`
    height: ${wp('15%')}px;
    flex-direction: row;
    margin-bottom: ${wp('5%')}px;
    margin-top: ${wp('2%')}px;
    align-items: center;
`;

const ResumeIcon = styled.View`
    height: ${wp('11%')}px;
    width: ${wp('11%')}px;
    align-items: center;
    justify-content: center;
    background-color: ${color.primary};
    border-radius: ${wp('3%')}px;
    margin-right: ${wp('3%')}px;
`;

const ResumeTitileWrap = styled.View`
    flex-direction: row;
`;

const ResumeTitle = styled.Text`
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroyMedium};
    max-width: ${wp('42%')}px;
    line-height: ${parseInt(sizes.font16) * 1.5}px;
    color: ${color.black};
`;

const ResumeInfo = styled.View`
    flex-grow: 1;
`;

const ResumeActions = styled.View`
    flex-direction: row;
`;
const ActionBtn = styled.TouchableOpacity`
    margin: 0 ${wp('2.5%')}px;
`;

export default JobRefer;
