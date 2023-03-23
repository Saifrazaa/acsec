import React, {useState, useContext, useEffect} from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-fontawesome-pro';
import {useRoute} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useQuery} from 'react-query';
import DocumentPicker from 'react-native-document-picker';
import {KeyboardAvoidingView, Platform} from 'react-native';

import JobCard from '../../components/job-card/job-card-applying';
import Layout from '../../components/layout';
import FormButton from '../../shared-components/button/form-button';
import {
    color,
    fonts,
    handleFileType,
    handleMimeType,
    handlePhoneNumber,
    Iconsizes,
    sizes,
} from '../../shared-components/helper';
import CustSelect from '../../shared-components/select/select';
import Input from '../../shared-components/input/input';
import AlertModal from '../../shared-components/popups/alertModal';
import {UserContext} from '../../context/user';
import {useApplyJob} from '../../hooks/useJobData';
import {Loader, LoaderWrapper} from '../../shared-components/loader';
import {
    fetchUser,
    useResumeDelete,
    useResumeUpload,
} from '../../hooks/useUserData';
import AvatarInitials from '../../components/avatar-initials/avatar-initials';

const applyJobSchema = yup.object({
    location: yup.string().required('Please Select job location').nullable(),
    resume: yup.string().required('Resume is Required').nullable(),
    source: yup.string().required('Source is Required'),
    source_details: yup.string().when('source', {
        is: val => val === 'Website-CP-Other',
        then: yup.string().required('Source Detail is Required'),
        otherwise: yup.string(),
    }),
    cover_letter: yup.string(),
});

const JobApply = ({navigation}) => {
    const [successModal, setSuccessModal] = useState(false);
    const [resumes, setResumes] = useState([]);
    const [resumesOptions, setResumesOptions] = useState([]);
    const [jobLocations, setJobLocations] = useState([]);
    const [errModal, setErrModal] = useState(false);
    const [errMsgs, setErrMsgs] = useState([]);
    const [newResume, setNewResume] = useState(null);
    const {user} = useContext(UserContext);

    const {isFetching} = useQuery('get-profile', () => fetchUser(), {
        retry: false,
        onSuccess: data => {
            const dataNew = data?.data?.data?.details;
            setResumes(dataNew.resumes);
            const arr = [];
            dataNew.resumes.map((item, index) => {
                arr.push({
                    label: item.resume_name,
                    value: index,
                });
            });
            setResumesOptions(arr);
        },
        onError: err => {
            console.log('Error', err?.response?.data?.data?.message);
        },
    });

    const route = useRoute();
    const job = route.params.job_meta;

    const formik = useFormik({
        initialValues: {
            location: '',
            resume: '',
            source: '',
            cover_letter: '',
            source_details: '',
        },
        validationSchema: applyJobSchema,
        onSubmit: values => {
            onApplyJob(values);
        },
    });

    console.log('Formik values ->', formik.values);

    // Upload Resume
    const {mutate: UploadResume, isLoading: resumeLoading} = useResumeUpload({
        onSuccess: data => {
            if (data?.data?.data?.status === 200) {
                formik.setFieldValue(
                    'resume',
                    data.data.data.details.resume_name,
                );
                setNewResume(data.data.data.details);
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            setErrMsgs([
                response?.data?.data?.details?.resume ||
                    response?.data?.message,
            ]);
        },
    });

    // Delete Resume
    const {mutate: DeleteResume, isLoading: resumeDeleting} = useResumeDelete({
        onSuccess: data => {
            formik.setFieldValue('resume', '');
            setNewResume(null);
        },
        onError: ({response}) => {
            setErrModal(true);
            setErrMsgs([
                response?.data?.data?.details?.resume ||
                    response?.data?.message,
            ]);
        },
    });

    const handleDocumentSelection = async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                copyTo: 'documentDirectory',
            });
            if (handleMimeType(response[0].type)) {
                const resumeData = new FormData();
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
                resumeData.append('resume_name', resumeName);
                resumeData.append('resume', data);
                UploadResume(resumeData);
            } else {
                setErrModal(true);
                setErrMsgs([
                    'Please select a valid file type (.pdf, .doc, .docx)',
                ]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const {mutate: ApplyJob, isLoading} = useApplyJob({
        onSuccess: data => {
            if (data?.data?.data?.status === 200) {
                setSuccessModal(true);
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            if (response?.data?.data?.status === 400) {
                const arr = [];
                const errors = response?.data?.data?.details;
                if (errors && errors.length > 0) {
                    for (var keys in errors) {
                        arr.push(errors[keys]);
                    }
                    setErrMsgs(arr);
                } else {
                    setErrMsgs([response?.data?.message]);
                }
            }
        },
    });

    const onApplyJob = async v => {
        const resume =
            newResume && newResume !== null
                ? newResume
                : resumes[formik.values.resume];
        await ApplyJob({
            job_id: job?.job_id,
            cover_letter: v.cover_letter,
            city_id: v.location,
            source: v.source,
            source_details: v.source_details,
            resume_id: resume.ID,
            resume: resume.resume_url,
            form_name: 'apply_now',
        });
    };

    const headerOptions = {
        backBtn: true,
        backBtnAction: {
            screen: 'JobDetail',
        },
    };

    const platforms = [
        {
            label: 'Facebook',
            value: 'Facebook',
        },
        {
            label: 'LinkedIn',
            value: 'LinkedIn',
        },
        {
            label: 'Instagram',
            value: 'Instagram',
        },
        {
            label: 'Youtube',
            value: 'Youtube',
        },
        {
            label: 'Google',
            value: 'Google',
        },
        {
            label: 'Friends / Family',
            value: 'Website-CP',
        },
        {
            label: 'University / Institutes',
            value: 'Others-U',
        },
        {
            label: 'Email',
            value: 'Email',
        },
        {
            label: 'SMS',
            value: 'SMS-A',
        },
        {
            label: 'Other Please Specify',
            value: 'Website-CP-Other',
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
    }, [job, newResume]);
    return (
        <>
            <KeyboardAvoidingView
                behavior="padding"
                style={{flexGrow: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -400}>
                <Layout
                    noPadding
                    withHeader
                    headerOptions={headerOptions}
                    bgColor={color.lightest_gray}>
                    <ApplyFormWrapper>
                        <JobInfoBox>
                            <UserInfo>
                                <UserImgWrap>
                                    {(user?.avatar !== undefined &&
                                        user?.avatar !== '' && (
                                            <UserImg
                                                source={{uri: user.avatar}}
                                            />
                                        )) || (
                                        <AvatarInitials
                                            name={user.name}
                                            fontSize={sizes.font16}
                                        />
                                    )}
                                </UserImgWrap>

                                <UserDetails>
                                    <InfoText bigHeading>
                                        {user && user.name}
                                    </InfoText>
                                    <IconText>
                                        <Icon
                                            name="envelope"
                                            color={color.gray_text}
                                            size={wp('2.5%')}
                                        />
                                        <InfoText>
                                            {user && user.email}
                                        </InfoText>
                                    </IconText>
                                    <IconText>
                                        <Icon
                                            name="phone"
                                            color={color.gray_text}
                                            size={wp('2.5%')}
                                        />
                                        <InfoText>
                                            {user &&
                                                handlePhoneNumber(user.phone)}
                                        </InfoText>
                                    </IconText>
                                </UserDetails>
                                <EditProfileBtn
                                    onPress={() =>
                                        navigation.navigate('Profile')
                                    }>
                                    <Icon
                                        name="pen"
                                        type="light"
                                        color={color.white}
                                        size={wp('2.5%')}
                                    />
                                </EditProfileBtn>
                            </UserInfo>
                            <JobCard
                                jobApplying
                                title={job?.title}
                                locations={job?.locations.map(i => i.name)}
                                depart={job?.depart}
                                departBg={job?.departBg}
                                onPress={() => navigation.goBack()}
                                stroke
                            />
                        </JobInfoBox>
                        <ApplyForm>
                            {jobLocations.length > 1 ? (
                                <CustSelect
                                    label="Applying location for"
                                    placeholder="Select Location"
                                    value={formik.values.location}
                                    options={jobLocations}
                                    onValueChange={value =>
                                        formik.setFieldValue('location', value)
                                    }
                                    errorText={
                                        formik.touched.location &&
                                        formik.errors.location
                                    }
                                />
                            ) : (
                                jobLocations && (
                                    <>
                                        <Input
                                            label="Applying location for"
                                            value={jobLocations[0]?.label}
                                        />
                                    </>
                                )
                            )}

                            {(newResume && newResume !== null && (
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
                                                {newResume.resume_name}
                                            </ResumeTitle>
                                        </ResumeTitileWrap>
                                    </ResumeInfo>
                                    <ResumeActions>
                                        <ActionBtn
                                            onPress={() =>
                                                DeleteResume({
                                                    resume_id: newResume.ID,
                                                })
                                            }>
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
                                <CustSelect
                                    label="Resume"
                                    placeholder="Select Resume"
                                    value={formik.values.resume}
                                    labelAction
                                    onLabelPress={handleDocumentSelection}
                                    labelActionText="Add new"
                                    options={resumesOptions}
                                    onValueChange={value =>
                                        formik.setFieldValue('resume', value)
                                    }
                                    errorText={
                                        formik.touched.resume &&
                                        formik.errors.resume
                                    }
                                />
                            )}
                            <CustSelect
                                label="How did you hear about us?"
                                placeholder="Select Platform"
                                value={formik.values.source}
                                options={platforms}
                                onValueChange={value =>
                                    formik.setFieldValue('source', value)
                                }
                                errorText={
                                    formik.touched.source &&
                                    formik.errors.source
                                }
                            />
                            {formik.values.source === 'Website-CP-Other' && (
                                <Input
                                    placeholder="Enter Source"
                                    label="Source Details"
                                    value={formik.values.source_details}
                                    onValueChange={value =>
                                        formik.setFieldValue(
                                            'source_details',
                                            value,
                                        )
                                    }
                                    errorText={
                                        formik.touched.source_details &&
                                        formik.errors.source_details
                                    }
                                />
                            )}
                            <Input
                                label="What makes you unique (Optional)"
                                placeholder="Write something about you..."
                                multiline
                                noflines={5}
                                value={formik.values.cover_letter}
                                onValueChange={value =>
                                    formik.setFieldValue('cover_letter', value)
                                }
                                errorText={
                                    formik.touched.cover_letter &&
                                    formik.errors.cover_letter
                                }
                            />
                        </ApplyForm>
                    </ApplyFormWrapper>
                </Layout>
                <Layout noScroll footer bgColor={color.white}>
                    <FooterBtnWrap>
                        <FormButton
                            btnText="Submit"
                            btnWidth="100%"
                            onClick={formik.handleSubmit}
                        />
                    </FooterBtnWrap>
                </Layout>
            </KeyboardAvoidingView>

            <AlertModal
                title="Congratulations"
                text={`You have successfully applied for the position of `}
                jobTitle={job?.title || 'Not Found'}
                btnText="Continue Exploring"
                isVisible={successModal}
                onClose={() => setSuccessModal(false)}
                onClickBtn={() => [
                    setSuccessModal(false),
                    navigation.navigate('JobsListing'),
                ]}
            />
            <AlertModal
                title="Request Failed"
                text={'There are some errors in the request.'}
                errMsgs={errMsgs}
                btnText="OK"
                errModal
                isVisible={errModal}
                onClickBtn={() => {
                    setErrModal(false);
                }}
            />
            {(isLoading || isFetching || resumeLoading || resumeDeleting) && (
                <LoaderWrapper>
                    <Loader size={wp('12%')} />
                </LoaderWrapper>
            )}
        </>
    );
};

const NewUploadedResume = styled.View`
    height: ${wp('15%')}px;
    flex-direction: row;
    margin-bottom: ${wp('5%')}px;
    margin-top: ${wp('2%')}px;
    align-items: center;
`;

const FooterBtnWrap = styled.View`
    flex-direction: row;
    height: auto;
    justify-content: space-between;
`;

const ApplyFormWrapper = styled.View`
    padding: 0 ${wp('7%')}px;
`;

const JobInfoBox = styled.View`
    padding: ${wp('5%')}px;
    background-color: ${color.white};
    border-radius: ${wp('4%')}px;
    margin-top: ${wp('-27%')}px;
`;

const UserInfo = styled.View`
    flex-direction: row;
    margin-bottom: ${wp('5%')}px;
`;

const UserImgWrap = styled.View`
    height: ${wp('12%')}px;
    width: ${wp('12%')}px;
`;

const UserImg = styled.Image`
    height: 100%;
    width: 100%;
    border-radius: ${wp('50%')}px;
    resize-mode: cover;
`;

const UserDetails = styled.View`
    margin-left: ${wp('3%')}px;
`;

const IconText = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${wp('0.5%')}px;
`;

const InfoText = styled.Text`
    font-size: ${props => (props.bigHeading ? sizes.font20 : sizes.font12)};
    color: ${props => (props.bigHeading ? color.black : color.gray_text)};
    font-family: ${props =>
        props.bigHeading ? fonts.GilroyBold : fonts.GilroyMedium};
    margin-bottom: ${wp('0.5%')}px;
    ${props => {
        if (!props.bigHeading) {
            return `
                margin-left:${wp('1.5%')}px;
            `;
        }
    }}
`;

const EditProfileBtn = styled.TouchableOpacity`
    background-color: ${color.primary};
    height: ${wp('7%')}px;
    width: ${wp('7%')}px;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
    border-radius: ${wp('50%')}px;
    elevation: 15;
`;

const ApplyForm = styled.View`
    margin-top: ${wp('7%')}px;
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

export default JobApply;
