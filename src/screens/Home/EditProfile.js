import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    AsyncStorage, StyleSheet, Image, Dimensions
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {connect} from "react-redux";
import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {scale} from "../../lib/utils/scaleUtils";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import Header from '../../components/Header/OtherHeader';
import {axiosInstance} from "../../lib/api/axiosClient";
import {editProfile} from "../../lib/api/url";
import {apiRequest} from "../../lib/api/api";
import {updateUserData} from "../Auth/action/auth_actions";
import TouchItem from '../../components/TouchItem/_TouchItem';
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import { formStyles } from "../../../assets/styles/styles";



class EditProfile extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        modalLoader: false,
        username: this.props.auth.username,
        firstName: this.props.auth.firstName,
        lastName: this.props.auth.lastName,
        phoneNumber: this.props.auth.phoneNumber,
        password: "",
        passwordShow: false
    };

    componentDidMount() {

    }


    onhandleSubmit = () => {
        return
        const {goBack} = this.props.navigation;

        if (this.validate()) return;
        const {username, password} = this.state;

        this.setState({
            loading: true
        }, () => {
            apiRequest(editProfile, 'post', {
                "user": {
                    "username": username,
                }
            }).then(res => {
                alert("Profile updated successfully")
                this.setState({
                    loading: false
                })
                // this.props.updateUserData({
                //     username
                // })
                goBack()
            })
                .catch(err => {
                    this.setState({
                        loading: false
                    })
                    alert("Invalid entry")

                });
        })

    };

    validate = () => {
        const {username} = this.state;


        let error = false;

        if (username === "") {
            this.setState({
                username_error: "Please enter your username",
            });
            error = true;
        }

        return error;
    };

    renderButton = () => {
        const {loading, username} = this.state;
        let requiredFields = !!username;
        if (loading) {
            return (
                <ButtonWithBackgroundBottom
                    activeOpacity={0.6}
                    disabled={loading}
                    style={
                        loading ? {backgroundColor: "rgba(28, 45, 65, 0.7)"} : {}
                    }
                >
                    <ActivityIndicator size="large" color="#fff"/>
                </ButtonWithBackgroundBottom>
            );
        }

        return (
            <ButtonWithBackgroundBottom
                onPress={this.onhandleSubmit}
                style={
                    requiredFields
                        ? {}
                        : {backgroundColor: "rgb(244,227,52)"}
                }
            >
                <ButtonWithBackgroundText>Save</ButtonWithBackgroundText>
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {goBack} = this.props.navigation;
        const {username, password,lastName,phoneNumber,firstName} = this.state;

        let profileImage = ''
        if (this.props.auth.profileImage) {
            profileImage = {uri: this.props.auth.profileImage}
        }
        return (
            <View>
                <Header title={"Edit Profile"} leftIcon={"md-arrow-back"}
                        onPressLeftIcon={() => this.props.navigation.goBack()}/>
                <KeyboardAwareScrollView
                    style={{backgroundColor: "#fff"}}
                    resetScrollToCoords={{x: 0, y: 0}}
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                    keyboardShouldPersistTaps={'handled'}
                    enableOnAndroid={true}
                >
                    <View style={styles.headerSection}>
                        <TouchItem onPress={this._pickImage}>
                            {!!profileImage && (
                                <Image
                                    style={{
                                        width: scale(158),
                                        height: scale(158),
                                        borderRadius: scale(79)
                                    }}
                                    //{/*{...{preview, ...background}}*/}
                                    source={profileImage}
                                    borderRadius={scale(79)}
                                    resizeMode={"cover"}
                                />
                            )}
                            {!profileImage && (
                                <View style={styles.profilePicture}>
                                    <Ionicons name={"ios-camera"} size={20}
                                              color={'white'}/>
                                </View>
                            )}
                           </TouchItem>
                    </View>
                    <View style={{width:'100%'}}>
                        <View>
                            <FloatingLabelInput
                                label="Full Name"
                                value={`${firstName} ${lastName}`}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'email-address'}
                                multiline={false}
                                autoCorrect={false}
                                labelColor={'#3A3A3A'}
                                style={{
                                    color:'#3A3A3A',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#7e7e7e',
                                }}
                                onChangeText={text => this.setState({name: text, name_error: ''})}
                            />
                            <Text style={styles.error}>{this.state.name_error}</Text>
                        </View>

                        <View>
                            <FloatingLabelInput
                                label="Email"
                                value={username}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'email-address'}
                                multiline={false}
                                autoCorrect={false}
                                labelColor={'#3A3A3A'}
                                style={{
                                    color:'#3A3A3A',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#7e7e7e',
                                }}
                                onChangeText={text => this.setState({username: text, username_error: ''})}
                            />
                            <Text style={styles.error}>{this.state.username_error}</Text>
                        </View>
                        <View>
                            <FloatingLabelInput
                                label="Email"
                                value={phoneNumber}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'email-address'}
                                multiline={false}
                                autoCorrect={false}
                                labelColor={'#3A3A3A'}
                                style={{
                                    color:'#3A3A3A',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#7e7e7e',
                                }}
                                onChangeText={text => this.setState({phoneNumber: text, phoneNumber_error: ''})}
                            />
                            <Text style={styles.error}>{this.state.phoneNumber_error}</Text>
                        </View>

                    </View>
                    <View style={{width:'100%'}}>
                        {/* <ButtonWithBackground onPress={() => navigate('Intro')}> */}
                        {this.renderButton()}
                    </View>
                </KeyboardAwareScrollView>
            </View>

        );
    }

    _pickImage = async () => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);

        if (status === 'granted' && cameraPermission.status === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                // allowsEditing: true,
                // aspect: [4, 4],
            });




            if (!result.cancelled) {
                this.props.updateUserData({
                    profileImage: result.uri
                })
                // this.props.showToast("Profile picture updated successfully", "success");
            }
        } else {
            throw new Error('Location permission not granted');
        }

    };
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication
    };
};

const mapDispatchToProps = {
    updateUserData
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditProfile);

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingLeft: scale(25),
        paddingRight: scale(25),
        marginTop: scale(30),
        paddingBottom: scale(70),
        width:'100%',
        minHeight: Dimensions.get('window').height
    },
    error: {
        fontSize: scale(10),
        color: "#ff3726",
        bottom: scale(3),
        position: "absolute",
        fontFamily: 'graphik-regular',
        right: 0
    },
    showpassword: {
        position: "absolute",
        alignItems: "flex-end",
        right: scale(8),
        top: '40%',
        paddingLeft: scale(10),
        paddingRight: scale(10)
    },
    formControl: {
        marginBottom: scale(40)
    },
    profilePicture: {
        width: scale(158),
        height: scale(158),
        backgroundColor: '#7e7e7e',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(79)
    },
    initial: {
        fontFamily: 'graphik-regular',
        fontSize: scale(18),
        textAlign: 'left',
        color: '#484848'
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(30),
        width: '100%'
    },
    title: {
        fontFamily: 'graphik-medium',
        fontSize: scale(32),
        textAlign: 'left',
        color: '#000'
    },

});
