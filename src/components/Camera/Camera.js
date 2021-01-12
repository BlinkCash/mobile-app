import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from "expo-permissions";
import * as ImageManipulator from 'expo-image-manipulator';


import styles from './styles';
import Toolbar from './toolbar';
// import Gallery from './gallery.component';
const DESIRED_RATIO = "16:9";

export default class CameraPage extends React.Component {
    camera = null;

    state = {
        captures: [],
        capturing: null,
        hasCameraPermission: null,
        autoFocus: Camera.Constants.AutoFocus.on,
        cameraType: Camera.Constants.Type.front,
        flashMode: Camera.Constants.FlashMode.off,
    };

    prepareRatio = async () => {
        if (Platform.OS === 'android' && this.camera) {
            const ratios = await this.camera.getSupportedRatiosAsync();

            // See if the current device has your desired ratio, otherwise get the maximum supported one
            // Usually the last element of "ratios" is the maximum supported ratio
            const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];

            this.setState({ ratio });
        }
    }

    setFlashMode = (flashMode) => this.setState({ flashMode });
    setCameraType = (cameraType) => this.setState({ cameraType });
    handleCaptureIn = () => this.setState({ capturing: true });

    handleCaptureOut = () => {
        if (this.state.capturing)
            this.camera.stopRecording();
    };

    handleShortCapture = async () => {

        const photoData = await this.camera.takePictureAsync({
            quality:0
        });

        // const manipResult = await ImageManipulator.manipulateAsync(
        //     photoData.localUri || photoData.uri,
        //     [{ resize: {width:50} }],
        //     { compress: 0, format: ImageManipulator.SaveFormat.JPEG }
        // );
        console.log(photoData)
        const manipResult = await ImageManipulator.manipulateAsync(
            photoData.uri,
            [{ resize: { height: 100 } }],
            { format: 'png' }
        );
        this.setState({ capturing: false, captures: [photoData, ...this.state.captures] },() => {
            this.props.navigation.navigate('userDetails', {
                photo:manipResult
            })
        })
    };

    handleLongCapture = async () => {
        const videoData = await this.camera.recordAsync();
        this.setState({ capturing: false, captures: [videoData, ...this.state.captures] });
    };

    async componentDidMount() {
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        // const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        const hasCameraPermission = (camera.status === 'granted');

        this.setState({ hasCameraPermission });
    };

    render() {
        const { hasCameraPermission, flashMode, cameraType, capturing, captures,autoFocus } = this.state;

        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>Access to camera has been denied.</Text>;
        }

        return (
            <React.Fragment>
                <View>
                    <Camera
                        type={cameraType}
                        flashMode={flashMode}
                        autoFocus={autoFocus}
                        onCameraReady={this.prepareRatio}
                        style={styles.preview}
                        ratio={this.state.ratio}
                        ref={camera => this.camera = camera}
                    />
                </View>

                {/*{captures.length > 0 && <Gallery captures={captures}/>}*/}

                <Toolbar
                    capturing={capturing}
                    flashMode={flashMode}
                    cameraType={cameraType}
                    setFlashMode={this.setFlashMode}
                    setCameraType={this.setCameraType}
                    onCaptureIn={this.handleCaptureIn}
                    onCaptureOut={this.handleCaptureOut}
                    // onLongCapture={this.handleLongCapture}
                    onShortCapture={this.handleShortCapture}
                />
            </React.Fragment>
        );
    };
};