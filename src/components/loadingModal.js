import React, {Component} from "react";
import {Button, Text, View, ActivityIndicator, StyleSheet} from "react-native";
import Modal from "react-native-modal";
// import Icon from 'react-native-vector-icons/FontAwesome';

export default class LoadingModal extends Component {

    render() {

        const {isModalVisible, onBackdropPress} = this.props;

        return (

            <Modal
                isVisible={isModalVisible}
                hideModalContentWhileAnimating={true}
                animationIn="fadeIn"
                animationOut="fadeOut"
                useNativeDriver={true}
                // onDismiss={onRequestClose}
                onBackdropPress={onBackdropPress}>
                <View style={styles.content}>
                   
                    <View>
                        <Text style={styles.contentTitle}>Loading</Text>
                        <Text style={styles.subTitle}>Please wait...</Text>
                    </View>
                    <View>
                        <ActivityIndicator animating={true} size='large'/>
                    </View>
                </View>
            </Modal>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 5,
        fontWeight: '500',
        color: '#000'
    },
    subTitle: {
        fontSize: 14
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0
    },
    scrollableModal: {
        height: 300
    },
    scrollableModalContent1: {
        height: 200,
        backgroundColor: '#87BBE0',
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollableModalText1: {
        fontSize: 20,
        color: 'white'
    },
    scrollableModalContent2: {
        height: 200,
        backgroundColor: '#A9DCD3',
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollableModalText2: {
        fontSize: 20,
        color: 'white'
    }
});