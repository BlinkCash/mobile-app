import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    AsyncStorage, Platform,
    Switch,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard,
    Modal, TouchableWithoutFeedback, Image, StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/OtherHeader';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
// import * as FaceDetector from 'expo-face-detector';


import {
    handleForgotPassword,
    resetAuthData, loginUserSuccess, getExtraDetails,
} from '../Auth/action/auth_actions';
import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import {
    postLogin,
    postRegister,
    checkfull_names,
    postAuthInit,
    confirmBVN,
    postAddEmail,
    postVerifyBVN, postUploadFile, postAddPhoto, putUpdateProfile
} from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
import { resetCache } from "../Auth/action/auth_actions";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import { apiRequest } from "../../lib/api/api";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TouchItem from "../../components/TouchItem/_TouchItem";


const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        const email = navigation.getParam('email', this.props.auth.email);

        this.state = {
            phone: '',
            profileImage: '',
            photo_url:''
        }
    }


    componentDidMount() {
    }


    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({result});
    };

    onhandleRegister = () => {
        Keyboard.dismiss();
        let {email, password, phone, full_name} = this.state;

        if (this.validate()) return;


        this.setState({
            loading: 'Uploading..',
        }, () => {
            apiRequest(putUpdateProfile, 'put',{
                "photo_url": this.state.photo_url
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {

                        if (res.status === 'success') {

                            this.props.loginUserSuccess({
                                photo_url:res.data.photo_url
                            })
                            this.props.showToast(res.message, 'success')
                            this.props.navigation.goBack();

                        } else {
                            this.props.showToast(res.message, 'error')
                        }
                        // this.props.showToast('Registration Complete. Please check your email for a confirmation link', 'success')
                    })
                })
                .catch(error => {
                    console.log(error.response)
                    //
                    if (error.response) {
                        this.props.showToast(error.response.data.message, 'error')
                    } else {
                        this.props.showToast(error.message, 'error')
                    }
                    this.setState({
                        loading: false
                    })
                });
        })
    };

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => {
                    if (this.state.profileImage) {
                        this.onhandleRegister()
                    } else {
                        this._pickImage();
                    }

                }}
                style={{width: '100%'}}

            >
                {/*{loading && (<ActivityIndicator size="large" color="#fff"/>)}*/}
                <ButtonWithBackgroundText>{this.state.profileImage ? 'Update Profile Picture' : 'Take a selfie'}</ButtonWithBackgroundText>
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, phone, confirm_password} = this.state;
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center'
            }}
            >
                <View
                    style={{
                        flex: 1
                    }}
                >
                    <LoaderText visible={this.state.loading} desciption={this.state.loading}/>
                    <KeyboardAwareScrollView
                        style={{backgroundColor: 'transparent', flex: 1}}
                        // resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={formStyles.container}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps={'handled'}
                        enableOnAndroid={true}
                        alwaysBounceVertical={false}
                        bounces={false}
                    >
                        <Header title={"Choose Picture"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}
                        />

                        <View style={[formStyles.auth_form, {flex: 1}]}>
                            <Text style={styles.title}>Please take a selfie of yourself in a well lit environment.
                            </Text>
                            <View style={{width: '100%', alignItems: 'center', marginVertical: scale(50)}}>

                                {!!this.state.profileImage && (
                                    <TouchItem
                                        onPress={this._pickImage}
                                        style={{
                                            width: scale(200),
                                            height: scale(200),
                                            overflow: 'hidden',
                                            // position: 'absolute',
                                            // top:10,
                                            // right:5,
                                            borderRadius: scale(10)
                                        }}
                                    >
                                        <Image
                                            style={{
                                                width: scale(200),
                                                height: scale(200),
                                                // position: 'absolute',
                                                // top:10,
                                                // right:5,
                                                borderRadius: scale(10)
                                            }}
                                            source={{uri: this.state.profileImage.uri}}
                                            resizeMode={'cover'}
                                        />
                                    </TouchItem>
                                )}
                                {!this.state.profileImage && (
                                    <Image
                                        style={{
                                            // width: scale(30),
                                            height: scale(200),
                                            // position: 'absolute',
                                            // top:10,
                                            // right:5,
                                            borderRadius: scale(5)
                                        }}
                                        source={require('../../../assets/images/selfie.png')}
                                        resizeMode={'contain'}
                                    />
                                )}

                            </View>
                            <View style={{marginBottom: scale(10)}}>
                                {this.renderButton()}
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }

    // detectFaces = async imageUri => {
    //     const options = { mode: FaceDetector.Constants.Mode.fast };
    //     return await FaceDetector.detectFacesAsync(imageUri, options);
    // };
    _pickImage = async () => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);

        if (status === 'granted' && cameraPermission.status === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                // allowsEditing: true,
                // aspect: [4, 4],
                quality: 0.2
            });


            if (!result.cancelled) {
                this.setState({
                    profileImage: result
                }, () => {
                    this.uploadFile()
                })
                // let faces = this.detectFaces(result.uri);
                // faces.then(res =>{
                //     if(res.faces.length){
                //         this.setState({
                //             profileImage: result
                //         }, () => {
                //             this.uploadFile()
                //         })
                //     }else{
                //         this.props.showToast("Could not detect a face", 'error')
                //     }
                //     console.log(res)
                // }).catch(e => {

                // })

                // this.setState({
                //     profileImage: result
                // }, () => {
                //     this.uploadFile()
                // })
                // this.props.showToast("Profile picture updated successfully", "success");
            }
        } else {
            throw new Error('Location permission not granted');
        }

    }


    uploadFile = () => {
        let formData = new FormData();

        let {profileImage} = this.state
        let localUri = profileImage.uri;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        formData.append('file', {uri: localUri, name: filename, type});

        this.setState({
            loading: "Processing",
        }, () => {
            apiRequest(postUploadFile, 'post', formData)
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {

                        if (res.success) {
                          this.setState({
                              photo_url: res.data.url
                          })
                        }else{
                            this.props.showToast(res.message, 'error')
                            this.setState({
                                profileImage:''
                            })

                        }

                    })
                })
                .catch(error => {
                    console.log(error.response)
                    //
                    if (error.response) {
                        this.props.showToast(error.response.data.message, 'error')
                    } else {
                        this.props.showToast(error.message, 'error')
                    }
                    this.setState({
                        loading: false,
                        profileImage: ''
                    })
                });
        })
    }


    validate = () => {

        let error = false;
        if (this.state.email === '') {
            this.setState({
                email_error: "Please enter your email address",
            })
            error = true;
        }
        return error
    }


    showPassword = () => {
        this.setState({
            passwordShow: !this.state.passwordShow
        })
    }
    showConfirmPassword = () => {
        this.setState({
            confirm_passwordShow: !this.state.confirm_passwordShow
        })
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication
    };
};

const mapDispatchToProps = {
    loginUserSuccess,
    handleForgotPassword,
    resetAuthData,
    showToast,
    getExtraDetails,
    resetCache,
    hideToast,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    title: {
        fontSize: scale(24),
        color: Colors.greyText,
        // textAlign: 'center',
        fontFamily: "graphik-medium",
        lineHeight: scale(32)
        // marginTop: scale(24),
    },
})