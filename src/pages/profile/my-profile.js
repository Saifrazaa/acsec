import React, {useContext, useState} from 'react';
import Icon from 'react-native-fontawesome-pro';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DocumentPicker from 'react-native-document-picker';
import PDFView from 'react-native-view-pdf';

import styled from 'styled-components';
import {
    useResumeDelete,
    useResumeUpload,
    useDelete,
} from '../../hooks/useUserData';
import IconButton from '../../shared-components/button/icon-button';
import {
    color,
    fonts,
    handleFileType,
    handleMimeType,
    Iconsizes,
    sizes,
} from '../../shared-components/helper';
import EditEducationPopup from '../../shared-components/popups/edit-education';
import EditExpPopup from '../../shared-components/popups/edit-experience';
import moment from 'moment';
import AlertModal from '../../shared-components/popups/alertModal';
import ConfirmationModal from '../../shared-components/popups/confirmationModal';
import {UserContext} from '../../context/user';
import {Loader, LoaderWrapper} from '../../shared-components/loader';
import {deleteUserToken} from '../../utils/token-manager';

const MyProfile = ({
    personalInfo,
    resumes,
    experiences,
    educations,
    onUpload,
}) => {
    const [expPopupVisible, setExpPopupVisible] = useState(false);
    const [expPopupData, setExpPopupData] = useState(undefined);
    const [eduPopupVisible, setEduPopupVisible] = useState(false);
    const [errModal, setErrModal] = useState(false);
    const [errMsgs, setErrMsgs] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [eduPopupData, setEduPopupData] = useState(undefined);
    const [openPDF, setOpenPdf] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfLoader, setPdfLoader] = useState(false);
    const {user, dispatchUser} = useContext(UserContext);

    // Upload Resume
    const {mutate: UploadResume, isLoading: resumeLoading} = useResumeUpload({
        onSuccess: data => {
            onUpload();
        },
        onError: ({response}) => {
            setErrModal(true);
            setErrMsgs(response?.data?.message);
        },
    });

    // Delete Resume
    const {mutate: DeleteResume, isLoading: resumeDeleting} = useResumeDelete({
        onSuccess: data => {
            onUpload();
        },
        onError: ({response}) => {
            setErrModal(true);
            setErrMsgs(response?.data?.message);
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
                setErrMsgs(
                    'Please select a valid file type (.pdf, .doc, .docx)',
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const {mutate: DeleteUser, isLoading: deletingUser} = useDelete({
        onSuccess: data => {
            if (data?.status === 200) {
                dispatchUser({
                    type: 'CLEAR_USER',
                    user: {
                        loggedIn: false,
                    },
                });
                deleteUserToken();
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            setErrMsgs(response?.data?.message);
        },
    });

    const deleteUserProfile = async () => {
        await DeleteUser();
    };

    return (
        <>
            {openPDF ? (
                <PDFViewer>
                    <ClosePdfViewr
                        onPress={() => [setOpenPdf(false), setPdfUrl('')]}>
                        <Icon
                            name="xmark"
                            size={Iconsizes.size30}
                            color={color.primary}
                        />
                    </ClosePdfViewr>
                    <PDFView
                        fadeInDuration={250.0}
                        style={{
                            width: wp('90%'),
                            height: hp('90%'),
                            zIndex: 999,
                        }}
                        resource={pdfUrl}
                        resourceType={'url'}
                        onLoad={() => [setPdfLoader(false)]}
                        onError={error => [setPdfLoader(false)]}
                    />
                    {pdfLoader && (
                        <LoaderWrapper>
                            <Loader size={wp('12%')} />
                        </LoaderWrapper>
                    )}
                </PDFViewer>
            ) : (
                <>
                    <Wrapper>
                        {/* About Section */}
                        <Section noBg>
                            <SectionHeading>About</SectionHeading>
                            <AboutText>
                                {user && user.summary && user.summary !== ''
                                    ? user.summary
                                    : 'Tell something about you...'}
                            </AboutText>
                        </Section>

                        {/* My Resume Section */}
                        <Section>
                            <SectionHeader>
                                <SectionHeading>My Resume</SectionHeading>
                                <SectionAction>
                                    <IconButton
                                        iconName="cloud-arrow-up"
                                        isLoading={
                                            resumeLoading || resumeDeleting
                                        }
                                        onPress={handleDocumentSelection}
                                    />
                                </SectionAction>
                            </SectionHeader>
                            <List>
                                {resumes && resumes.length > 0 ? (
                                    resumes.map((item, index) => {
                                        return (
                                            <ListItem
                                                key={index}
                                                noBorder={
                                                    index === resumes.length - 1
                                                }>
                                                <ResumeDetails
                                                    onPress={() => [
                                                        setOpenPdf(true),
                                                        setPdfUrl(
                                                            item.resume_url,
                                                        ),
                                                        setPdfLoader(true),
                                                    ]}>
                                                    <ResumeIcon>
                                                        <Icon
                                                            name="file"
                                                            color={color.white}
                                                            size={
                                                                Iconsizes.size20
                                                            }
                                                        />
                                                    </ResumeIcon>
                                                    <ResumeInfo>
                                                        <ResumeTitileWrap>
                                                            <ResumeTitle
                                                                numberOfLines={
                                                                    1
                                                                }>
                                                                {
                                                                    item.resume_name
                                                                }
                                                            </ResumeTitle>
                                                        </ResumeTitileWrap>
                                                        <ResumeUploadDate>
                                                            {moment(
                                                                item.created_at,
                                                            ).format(
                                                                'DD/MM/YYYY',
                                                            )}
                                                        </ResumeUploadDate>
                                                    </ResumeInfo>
                                                </ResumeDetails>
                                                <ResumeActions>
                                                    <ActionBtn
                                                        onPress={() =>
                                                            DeleteResume({
                                                                resume_id:
                                                                    item.ID,
                                                            })
                                                        }>
                                                        <Icon
                                                            name="trash"
                                                            type="light"
                                                            color={color.danger}
                                                            size={
                                                                Iconsizes.size18
                                                            }
                                                        />
                                                    </ActionBtn>
                                                </ResumeActions>
                                            </ListItem>
                                        );
                                    })
                                ) : (
                                    <EmptyListText>No resume yet</EmptyListText>
                                )}
                            </List>
                        </Section>

                        {/* Work Experience */}
                        <Section>
                            <SectionHeader>
                                <SectionHeading>Work Experience</SectionHeading>
                                <SectionAction>
                                    <IconButton
                                        iconName="plus"
                                        onPress={() => [
                                            setExpPopupVisible(true),
                                            setExpPopupData(undefined),
                                        ]}
                                    />
                                </SectionAction>
                            </SectionHeader>
                            <List>
                                {experiences && experiences.length > 0 ? (
                                    experiences.map((item, index) => {
                                        const stDate = item.startdate;
                                        return (
                                            <ListItem
                                                key={index}
                                                noBorder={
                                                    index ===
                                                    experiences.length - 1
                                                }>
                                                <ListItemLeft>
                                                    <ListTitle
                                                        numberOfLines={2}>
                                                        {item.job_title}
                                                    </ListTitle>
                                                    <ListSubTitle>
                                                        <ListSubText>
                                                            {item.company_name}
                                                        </ListSubText>
                                                        <RedDot />
                                                        <ListSubText>
                                                            {
                                                                item.employment_type
                                                            }
                                                        </ListSubText>
                                                    </ListSubTitle>
                                                    <StartEndDate>
                                                        <Date>
                                                            {moment(
                                                                stDate,
                                                            ).format(
                                                                'DD/MM/YYYY',
                                                            )}
                                                        </Date>
                                                        <Dash>-</Dash>
                                                        <Date>
                                                            {item.currently_working !==
                                                            '0'
                                                                ? 'Currently working here'
                                                                : moment(
                                                                      item.enddate,
                                                                  ).format(
                                                                      'DD/MM/YYYY',
                                                                  )}
                                                        </Date>
                                                    </StartEndDate>
                                                </ListItemLeft>
                                                <ListItemRight>
                                                    <IconButton
                                                        iconName="pencil"
                                                        bgColor="transparent"
                                                        btnColor={
                                                            color.gray_text
                                                        }
                                                        onPress={() => [
                                                            setExpPopupData(
                                                                item,
                                                            ),
                                                            setExpPopupVisible(
                                                                true,
                                                            ),
                                                        ]}
                                                    />
                                                </ListItemRight>
                                            </ListItem>
                                        );
                                    })
                                ) : (
                                    <EmptyListText>
                                        No experience yet
                                    </EmptyListText>
                                )}
                            </List>
                        </Section>

                        {/* Education Experience */}
                        <Section>
                            <SectionHeader>
                                <SectionHeading>Education</SectionHeading>
                                <SectionAction>
                                    <IconButton
                                        iconName="plus"
                                        onPress={() => [
                                            setEduPopupVisible(true),
                                            setEduPopupData(undefined),
                                        ]}
                                    />
                                </SectionAction>
                            </SectionHeader>
                            <List>
                                {educations && educations.length > 0 ? (
                                    educations.map((item, index) => {
                                        return (
                                            <ListItem
                                                key={index}
                                                noBorder={
                                                    index ===
                                                    educations.length - 1
                                                }>
                                                <ListItemLeft>
                                                    <ListTitle
                                                        numberOfLines={2}>
                                                        {item.institute}
                                                    </ListTitle>
                                                    <ListSubText>
                                                        {item.degree_title}
                                                    </ListSubText>
                                                    <StartEndDate>
                                                        <Date>
                                                            {item.start_year}
                                                        </Date>
                                                        <Dash>-</Dash>
                                                        <Date>
                                                            {item.currently_studying !==
                                                            '0'
                                                                ? 'Currently studying here'
                                                                : item.end_year}
                                                        </Date>
                                                    </StartEndDate>
                                                </ListItemLeft>
                                                <ListItemRight>
                                                    <IconButton
                                                        iconName="pencil"
                                                        bgColor="transparent"
                                                        btnColor={
                                                            color.gray_text
                                                        }
                                                        onPress={() => [
                                                            setEduPopupVisible(
                                                                true,
                                                            ),
                                                            setEduPopupData(
                                                                item,
                                                            ),
                                                        ]}
                                                    />
                                                </ListItemRight>
                                            </ListItem>
                                        );
                                    })
                                ) : (
                                    <EmptyListText>
                                        No education yet
                                    </EmptyListText>
                                )}
                            </List>
                        </Section>

                        {/* Delete My Profile Button */}
                        <Section>
                            <DeleteProfileBtn
                                onPress={() => setConfirmModal(true)}>
                                <BtnText>Delete My Profile</BtnText>
                            </DeleteProfileBtn>
                        </Section>
                    </Wrapper>

                    <EditExpPopup
                        isVisible={expPopupVisible}
                        onClose={() => [
                            setExpPopupData(undefined),
                            setExpPopupVisible(false),
                        ]}
                        expData={expPopupData}
                        onUpdate={onUpload}
                    />
                    <EditEducationPopup
                        isVisible={eduPopupVisible}
                        onClose={() => [
                            setEduPopupData(undefined),
                            setEduPopupVisible(false),
                        ]}
                        eduData={eduPopupData}
                        onUpdate={onUpload}
                    />
                    <AlertModal
                        title="Request Failed"
                        text={errMsgs}
                        btnText="Retry"
                        errModal
                        isVisible={errModal}
                        onClickBtn={() => {
                            setErrModal(false);
                        }}
                    />
                    <ConfirmationModal
                        isVisible={confirmModal}
                        title={'Are you sure you want to delete your profile?'}
                        text={
                            'Once deleted your profile information, job applications, and referrals will be permanently removed from the talentibex system.'
                        }
                        onClose={() => setConfirmModal(false)}
                        onClickConfirm={() => [
                            setConfirmModal(false),
                            deleteUserProfile(),
                        ]}
                    />
                </>
            )}
        </>
    );
};
const Wrapper = styled.View`
    padding: 0 ${wp('5%')}px;
    width: ${wp('100%')}px;
`;

const Section = styled.View`
    background-color: ${color.white};
    border-radius: ${wp('2%')}px;
    margin-bottom: ${wp('5%')}px;
    border-width: 1px;
    border-color: ${color.black}1A;
    ${props => {
        if (props.noBg) {
            return `
                background-color:transparent;
                border-width: 0px;
                margin-top:${wp('3%')}px;
                margin-bottom:${wp('8%')}px;
                margin-left:${wp('1%')}px;
            `;
        }
    }}
`;
const SectionHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${wp('5%')}px;
    padding-top: ${wp('4%')}px;
`;

const List = styled.View`
    padding: 0 ${wp('5%')}px;
`;

const SectionHeading = styled.Text`
    font-size: ${sizes.font20};
    font-family: ${fonts.GilroySemiBold};
    color: ${color.black};
`;
const SectionAction = styled.View``;

const ListItem = styled.View`
    flex-direction: row;
    padding: ${wp('5%')}px 0;
    border-bottom-width: ${props => (props.noBorder ? 0 : `${1}px`)};
    border-bottom-color: ${color.black}33;
    align-items: center;
    justify-content: space-between;
`;

const ListItemLeft = styled.View``;

const ListTitle = styled.Text`
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroyMedium};
    max-width: ${wp('70%')}px;
    color: ${color.black};
`;
const ListSubTitle = styled.View`
    flex-direction: row;
    align-items: center;
`;

const ListSubText = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyRegular};
    color: ${color.black};
`;

const RedDot = styled.View`
    height: ${wp('1%')}px;
    width: ${wp('1%')}px;
    background-color: ${color.primary};
    border-radius: ${wp('50%')}px;
    margin: 0 ${wp('2%')}px;
`;

const StartEndDate = styled.View`
    flex-direction: row;
    align-items: center;
`;

const Date = styled.Text`
    font-size: ${sizes.font12};
    font-family: ${fonts.GilroyRegular};
    color: ${color.light_grey};
`;

const Dash = styled.Text`
    margin: 0 ${wp('1.5%')}px 2px;
    color: ${color.light_grey};
    font-family: ${fonts.GilroyRegular};
`;

const ListItemRight = styled.View``;

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

const ResumeUploadDate = styled.Text`
    font-size: ${sizes.font12};
    font-family: ${fonts.GilroyMedium};
    color: ${color.light_grey};
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

const AboutText = styled.Text`
    font-size: ${sizes.font18};
    font-family: ${fonts.GilroyMedium};
    line-height: ${parseInt(sizes.font16) * 1.7}px;
    margin-top: ${wp('5%')}px;
    color: ${color.gray_text};
`;

const EmptyListText = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyMedium};
    color: ${color.gray_text};
    margin-top: ${wp('3%')}px;
    margin-bottom: ${wp('5%')}px;
`;

const PDFViewer = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 99;
    background-color: ${color.white};
    align-items: center;
    padding-top: ${wp('25%')};
`;

const ResumeDetails = styled.TouchableOpacity`
    flex-direction: row;
    flex: 1 0;
`;

const ClosePdfViewr = styled.TouchableOpacity`
    position: absolute;
    top: 50px;
    right: 20px;
`;

const DeleteProfileBtn = styled.TouchableOpacity`
    padding: ${wp('4%')}px;
`;

const BtnText = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyMedium};
    color: ${color.primary};
`;

export default MyProfile;
