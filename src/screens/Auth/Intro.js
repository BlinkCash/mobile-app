import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    ImageBackground,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { verticalScale, scale } from "../../lib/utils/scaleUtils";
import { ButtonWithBackgroundBottom, ButtonWithBackgroundText } from "../../components/Button/Buttons";
import _TouchItem from '../../components/TouchItem/_TouchItem'
import { connect } from "react-redux";
import { Colors } from "../../lib/constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';
import { loginUserSuccess } from "./action/auth_actions";
import EnterBankDetails from "./EnterBankDetails";

const ACCESS_TOKEN = 'access_token';


const styles = StyleSheet.create({
    image: {
        width: '100%',
        minHeight: '60%',
        maxHeight: scale(400)
    },
    container: {
        flexDirection: "column",
        justifyContent: 'space-between',
        flex: 1
    },
    mainContent: {
        alignItems: 'center'
    },
    title: {
        fontSize: scale(20),
        color: Colors.greyText,
        textAlign: 'center',
        // fontFamily: "AvenirLTStd-Heavy",
        fontFamily: "graphik-semibold",
        // marginTop: scale(24),
    },
    description: {
        fontSize: scale(17),
        lineHeight: scale(26),
        color: Colors.greyText,
        textAlign: 'center',
        fontFamily: "graphik-regular",
        maxWidth: scale(300),
        alignSelf: 'center',
        marginTop: scale(16)
    },
    buttonAreaContainer: {
        position: 'absolute',
        paddingBottom: 5,
        height: scale(180),
        bottom: 0,
        width: '100%',
        paddingLeft: scale(24),
        paddingRight: scale(24),
        paddingTop: scale(17)
    },
    paginationItem: {
        width: scale(8),
        height: scale(8),
        backgroundColor: '#C4C4C4',
        marginRight: scale(8),
        borderRadius: scale(4),
        opacity: 0.5
    },
    selectedPaginatedItem: {
        width: scale(14),
        height: scale(14),
        marginRight: scale(8),
        borderRadius: scale(7),
        backgroundColor: Colors.tintColor
    }
});


const slides = [
    {
        key: 2,
        title: 'Instant loans at a blink',
        text: 'Get instant loans with ease on your smartphone.',
        image: require('../../../assets/images/Intro/Illustrations.png'),
        imageStyle: styles.image
    },
    {
        key: 3,
        title: 'Save little, earn more',
        text:
            'Savings gives you financial options. Save and earn at the same time.',
        image: require('../../../assets/images/Intro/Illustrations-1.png'),
        imageStyle: styles.image
    },
    {
        key: 4,
        title: 'Multiple savings options ',
        text:
            'Set up multiple savings plans to reach your financial goals.',
        image: require('../../../assets/images/Intro/Illustrations-2.png'),
        imageStyle: styles.image,
    }
];

class IntroScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    state = {
        activePaginationIndex: 0,
        favOpen: true
    }


    async storeToken(accessToken) {
        try {
            await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
            this.getToken();
        } catch (error) {
            console.log('while storing token something went wrong');
        }
    }

    getToken = async () => {
        try {
            let token = await AsyncStorage.getItem(ACCESS_TOKEN);
            console.log(`token for the app is is is ${token}`);
        } catch (error) {
            console.log('something went wrong');
        }
    }

    componentDidMount() {
        // this.props.navigation.navigate('OnboardingSuccess')
        // this.props.loginUserSuccess({
        //     stage_id:3,
        //     access_token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTc0OTgxNzY2LCJleHAiOjE1NzQ5ODUzNjZ9.5hjts5rqei7r04doq5gRZXBReeSH7qea5r8LuMjQHaQ'
        // })
        //
        // this.storeToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTc0OTgxNzY2LCJleHAiOjE1NzQ5ODUzNjZ9.5hjts5rqei7r04doq5gRZXBReeSH7qea5r8LuMjQHaQ')
    }

    renderItems = ({item}) => {
        return (
            <ImageBackground
                style={{
                    flex: 1,
                    width: '100%'
                }}
                resizeMode={'cover'}
                source={item.image}
            >

                <View style={{width: '100%', position: 'absolute', bottom: scale(180)}}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.text}</Text>
                </View>
            </ImageBackground>
        )
    };

    onSlideChange = (index) => {
        this.setState({
            activePaginationIndex: index
        })
    }

    goToAuthPage = () => {
        this.props.navigation.navigate('EnterNumber')
        // if (this.props.auth.stage_id === 1) {
        //     this.props.navigation.navigate('EnterBVN')
        // } else if (this.props.auth.stage_id === 2) {
        //     this.props.navigation.navigate('EnterEmail')
        // } else if (this.props.auth.stage_id === 3) {
        //     this.props.navigation.navigate('EnterPicture')
        // } else {
        //     this.props.navigation.navigate('EnterNumber')
        // }
    }

    render() {

        // const userToken = this.props.auth.access_token;

        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <View style={styles.container}>
                    <View style={{position: 'absolute', top: scale(24), left: scale(24), zIndex: 9999}}>
                        <Image
                            style={{
                                // height: scale(30),
                                width: scale(150),
                            }}
                            resizeMode={'contain'}
                            source={require('../../../assets/logo.png')}
                        />
                    </View>
                    <AppIntroSlider
                        renderItem={this.renderItems}
                        slides={slides}
                        activeDotStyle={
                            {
                                backgroundColor: '#666',
                                alignSelf: 'flex-end'
                            }
                        }
                        dotStyle={{alignSelf: 'flex-end', backgroundColor: 'rgba(87, 145, 170, 0.4399999976158142)'}}
                        activeDotColor={'#0275d8'}
                        // showSkipButton={true}
                        hideNextButton={true}
                        hideDoneButton={true}
                        onSlideChange={this.onSlideChange}
                        hidePagination={true}
                    />
                    <View style={styles.buttonAreaContainer}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View
                                    style={this.state.activePaginationIndex === 0 ? styles.selectedPaginatedItem : styles.paginationItem}/>
                                <View
                                    style={this.state.activePaginationIndex === 1 ? styles.selectedPaginatedItem : styles.paginationItem}/>
                                <View
                                    style={this.state.activePaginationIndex === 2 ? styles.selectedPaginatedItem : styles.paginationItem}/>
                            </View>
                        </View>

                        <ButtonWithBackgroundBottom
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                                marginTop: scale(30),
                                marginBottom: scale(20),
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                                shadowOffset: {
                                    width: 0,
                                    height: scale(12)
                                },
                                shadowRadius: 11,
                                shadowOpacity: 1.0,
                                elevation: 2,
                            }}
                            onPress={() => this.goToAuthPage()}
                        >
                            <ButtonWithBackgroundText style={{lineHeight: scale(56)}}>Get
                                Started</ButtonWithBackgroundText>
                        </ButtonWithBackgroundBottom>


                        <TouchableOpacity style={{width: '100%', alignItems: 'center'}}
                                          onPress={() => this.props.navigation.navigate('Login')}>
                            <Text
                                style={{
                                    color: Colors.tintColor,
                                    fontSize: scale(17),
                                    fontFamily: 'graphik-semibold'
                                }}
                            >
                                Log In
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        home: state.home,
        eCash: state.eCash
    };
};

const mapDispatchToProps = {loginUserSuccess};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IntroScreen);
