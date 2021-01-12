import React from 'react';
import { ActivityIndicator, View, Text, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { scale } from "../../lib/utils/scaleUtils";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import { formStyles } from "../../../assets/styles/styles";
import { Colors } from "../../lib/constants/Colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";


class PinScreen extends React.Component {

    state = {
        pin: ''
    }

    onChangePassword = (pin) => {
        this.setState({
            pin,
            pin_error: ''
        }, () => {
            if (this.state.pin.length === 4) {
                this.props.handleSubmit(this.state.pin);
            }
            this.props.resetError && this.props.resetError()
        })
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.wrongPinError && this.props.wrongPinError){
            this.setState({
                pin:''
            })
        }
    }
    render() {
        if (this.props.visible) {
            return (
                <Modal
                    // transparent={true}
                    // onRequestClose={() => {
                    // }}
                    // animationIn={'slideInUp'}
                    // onBackdropPress={() => {
                    //     this.setState({
                    //         pin:''
                    //     })
                    //     this.props.close()
                    // }}
                    // isVisible={this.props.visible}
                    // style={{
                    //     margin: 0, paddingHorizontal: scale(30),
                    //     flexDirection: 'row', justifyContent: 'center',
                    //     alignItems: 'flex-end'
                    // }}
                    // backdropColor={"rgb(17, 41, 69)"}
                    // backdropOpacity={0.98}
                    // avoidKeyboard={true}

                    transparent={true}
                    onRequestClose={() => {}}

                    isVisible={this.props.visible}
                    backdropOpacity={0.98}
                    backdropColor={"rgb(17, 41, 69)"}
                    onBackdropPress={() => {
                        // this.setState({
                        //     pin:''
                        // })
                        // this.props.close()
                    }}
                    // animationIn="fadeIn"
                    // animationOut="fadeOut"
                    coverScreen={false}
                    style={{
                        margin: 0,
                        paddingHorizontal: scale(30),
                        flexDirection: 'row',
                        justifyContent: 'center',
                        // backgroundColor:'red',
                        alignItems: 'center'
                    }}
                    avoidKeyboard={true}
                >
                    <View style={{}}>
                        {!!this.props.wrongPinError && (
                            <View>
                                {/*<Text style={styles.bigText}>Forgot PIN ?</Text>*/}
                                <Text style={[styles.bigText, {
                                    color: '#EB5757',
                                    marginBottom: scale(20)
                                }]}>{this.props.wrongPinError}</Text>
                            </View>
                        )}

                        {!this.props.loading && (
                            <Text style={styles.title}>Please enter your Authorization PIN</Text>
                        )}
                        {!!this.props.loading && (
                            <View>
                                <ActivityIndicator size="large" color="#fff"/>
                            </View>
                        )}
                        <View style={{
                            marginTop: scale(28),
                            width: '100%',
                            alignItems: 'center',
                            marginBottom: scale(30)
                        }}>
                            <SmoothPinCodeInput
                                cellStyle={null}
                                cellStyleFocused={null}
                                password
                                // mask="﹡"
                                mask={<View style={{
                                    width: scale(24),
                                    height: scale(24),
                                    borderRadius: scale(12),
                                    backgroundColor: !!this.props.wrongPinError ? '#EB5757' : Colors.tintColor,
                                }}/>}
                                placeholder={<View style={{
                                    width: scale(24),
                                    height: scale(24),
                                    borderRadius: scale(12),
                                    opacity: 0.5,
                                    backgroundColor: '#9AA5B1',
                                }}/>}
                                containerStyle={{
                                    backgroundColor: 'white',
                                    height: scale(60),
                                    borderRadius: scale(30)
                                }}
                                codeLength={4}
                                cellSpacing={scale(30)}
                                value={this.state.pin}
                                // password={true}
                                autoFocus={true}
                                onTextChange={password => this.onChangePassword(password)}
                            />
                        </View>
                    </View>

                    {/*</KeyboardAwareScrollView>*/}
                </Modal>)
        }
        return null
    }
}

export { PinScreen }
const styles = StyleSheet.create({

    title: {
        fontFamily: 'graphik-regular',
        fontSize: scale(16),
        color: 'white',
        lineHeight: scale(22),
        textAlign: 'center'
    },
    bigText: {
        fontSize: scale(24),
        marginBottom: scale(60),
        fontFamily: 'graphik-semibold',
        color: Colors.white,
        textAlign: 'center'
    },
    topHeader: {
        fontSize: scale(14),
        fontFamily: 'graphik-regular',
        color: Colors.greyText,
        marginBottom: scale(25),
        textAlign: 'center'
    },
    topAmount: {
        fontSize: scale(32),
        fontFamily: 'graphik-medium',
        color: Colors.greyText,
        textAlign: 'center'
    }

})