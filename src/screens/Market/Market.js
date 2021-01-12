import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    AsyncStorage, Share, PermissionsAndroid, TextInput, PanResponder, RefreshControl, Dimensions
} from 'react-native';
import { scale, verticalScale } from "../../lib/utils/scaleUtils";
import noImage from "../../../assets/images/noImageDataURI";
import getSymbolFromCurrency from "currency-symbol-map";
import { getUser, getMarket } from "./action/market_actions";
import Carousel from 'react-native-snap-carousel';


import { logoutUserSuccess } from "../Auth/action/auth_actions";
import { connect } from 'react-redux';
import _TouchItem from '../../components/TouchItem/_TouchItem';
import { Colors } from '../../lib/constants/Colors'

import FadeInView from '../../components/AnimatedComponents/FadeInView';
import { withNavigationFocus } from 'react-navigation';
import { formatAmount } from "../../lib/utils/helpers";
import { LoaderText } from "../../components/Loader/Loader";
// import { frontendUrl } from "../../lib/api/url";
// import SmsAndroid from 'react-native-get-sms-android';
import NavigationService from "../../../NavigationService";
import ListViewItem from './ListViewMarketItem'
import { Rating,AirbnbRating } from "react-native-elements";
export const STAR_IMAGE = require("../../../assets/images/starIcon/star2.png");
import StarRating from 'react-native-star-rating';


import {
    Ionicons,
    SimpleLineIcons
} from "@expo/vector-icons";
import moment from 'moment'

const preview = {uri: noImage};

class HomeScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            searchTerm: '',
            showModal: false,
            inactive: true,
            viewType: 'list'
        }

    }


    static navigationOptions = {
        header: null,
    };

    componentDidMount() {

        console.log(this.props.auth)
        this.props.getMarket(this.props.auth.user_id);

    }


    componentWillUnmount() {
        clearTimeout(this.timeout)
    }


    refreshData = () => {
        this.props.getMarket(this.props.auth.user_id);
        // this.props.getDashboard(this.props.auth.access_token);
    }


    componentDidUpdate(prevProps, prevState) {

    }

    changeViewType = (type) => {
        this.setState({
            viewType: type
        })
    }


    _renderCarouselItem = ({item, index}) => {
        return (
            <FadeInView style={styles.card}>
                <View style={{
                    // flexDirection: 'row',
                    // justifyContent: 'space-between',
                    // alignItems: 'center'
                }}>
                  <View>
                      <Text style={styles.cardTitle}>{item.LEGAL_NAME}</Text>
                      <Text style={styles.cardService}>{item.OCCUPATION}</Text>
                  </View>
                    {/*<View>*/}
                        {/*<StarRating*/}
                            {/*disabled={true}*/}
                            {/*maxStars={5}*/}
                            {/*rating={item.PEOPLE_RATING_ID}*/}
                            {/*fullStarColor={'white'}*/}
                            {/*emptyStarColor={'white'}*/}
                            {/*animation="slideInDown"*/}
                            {/*starSize={13}*/}
                            {/*// selectedStar={(rating) => this.onStarRatingPress(rating)}*/}
                        {/*/>*/}
                        {/*<Text style={styles.cardService}>{item.GENDER}</Text>*/}
                    {/*</View>*/}
                </View>

                <View style={{
                    marginTop: scale(20),
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection:'row'
                }}>

                    <View>
                        <Text style={styles.cardService}>Rating</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={item.PEOPLE_RATING_ID}
                            fullStarColor={'white'}
                            emptyStarColor={'white'}
                            animation="slideInDown"
                            starSize={13}
                            // selectedStar={(rating) => this.onStarRatingPress(rating)}
                        />
                    </View>
                    <View>
                        <Text style={styles.cardService}>{item.GENDER}</Text>
                        {/*<Text style={styles.cardInnerHeader}>{item.REQUEST_TENOR} {item.LOAN_DURATION}</Text>*/}
                    </View>

                </View>
                <View style={{
                    marginTop: scale(20),
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection:'row'
                }}>

                    <View>
                        <Text style={styles.cardService}>Loan Amount</Text>
                        <Text style={styles.cardInnerHeader}>{item.REQUEST_PRINCIPAL}</Text>
                    </View>
                    <View>
                        <Text style={styles.cardService}>Loan Duration</Text>
                        <Text style={styles.cardInnerHeader}>{item.REQUEST_TENOR} {item.LOAN_DURATION}</Text>
                    </View>

                </View>
                <View style={{
                    marginTop: scale(20),
                }}>

                    <View>
                        <Text style={styles.cardService}>Loan Purpose</Text>
                        <Text style={styles.cardInnerHeader}>{item.DESCRIPTION || 'N/A'}</Text>
                    </View>

                </View>
                <View style={{
                    marginTop: scale(20),
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection:'row'
                }}>

                    <View style={{
                    }}>
                        <Text style={styles.cardService}>Address</Text>
                        <Text style={styles.cardInnerHeader}>** ***{item.BORROWER_ADDRESS_STATE}</Text>
                    </View>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={styles.cardService}>Age</Text>
                        <Text style={styles.cardInnerHeader}>{Math.abs(moment(`${item.BIRTH_MONTH}-${item.BIRTH_DAY}-${item.BIRTH_YEAR}`, "MM-DD-YYYY").diff(moment(), 'years'))}</Text>
                    </View>
                    {/*<View style={styles.cardMonthly}>*/}
                        {/*<Text style={styles.cardInnerHeader}>₦350</Text>*/}
                        {/*<Text style={[styles.cardService]}>Monthly payment</Text>*/}
                    {/*</View>*/}

                </View>
                <View style={{
                    marginTop: scale(20),
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection:'row'
                }}>


                    <View>
                        <Text style={styles.cardService}>Employer</Text>
                        <Text style={styles.cardInnerHeader}>{"Lorem Ipsum"}</Text>
                    </View>
                    <View>
                        <Text style={styles.cardService}>Monthly income</Text>
                        <Text style={styles.cardInnerHeader}>₦{formatAmount(Number(item.NET_MONTHLY_INCOME))}</Text>
                    </View>

                </View>
                <View style={{
                    marginTop: scale(20),
                }}>

                    <View>
                        <Text style={styles.cardService}>Industry</Text>
                        <Text style={styles.cardInnerHeader}>{item.WORK_SECTOR}</Text>
                    </View>

                </View>
            </FadeInView>
        );
    }

    render() {
        let profileImage = ''
        if (this.props.auth.avatar) {
            profileImage = {uri: this.props.auth.avatar}
        }



        return (
            <View style={{
                backgroundColor: '#fff',
                flex: 1
            }}>
                <ScrollView
                    style={styles.container}
                    scrollEnabled={true}
                    keyboardShouldPersistTaps={'handled'}
                    alwaysBounceVertical={false}
                    bounces={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.loading_dashboard}
                            onRefresh={() => this.refreshData()}
                        />
                    }
                >
                    <View>
                        <LoaderText visible={this.state.loading} desciption={'Processing'}/>
                        <View
                            style={styles.topHeader}

                        >
                            <View style={{
                                width: '100%',
                                // paddingTop: scale(21),
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Text style={styles.welcomeTitle}>Market Place</Text>
                                <Text style={styles.date}>{moment().format('MMMM D, YYYY')}</Text>
                                {/*<Text style={styles.date}>{moment().format('MMMM D, YYYY')}</Text>*/}
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginTop: scale(30),
                                alignItems: 'center'
                            }}>
                                <View>
                                    <Text style={styles.topLabel}>Wallet Balance</Text>
                                    <Text
                                        style={styles.topAmount}>₦{formatAmount(this.props.wallet_balance)}</Text>
                                </View>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginTop: scale(17),
                                alignItems: 'center'
                            }}>
                                <View>
                                    <Text style={styles.otherTopLabel}>Crowd Funded</Text>
                                    <Text
                                        style={styles.topSubtitles}>₦24,900,989</Text>
                                </View>
                                {/*<View>*/}
                                    {/*<Text style={styles.otherTopLabel}>Active Lenders</Text>*/}
                                    {/*<Text*/}
                                        {/*style={styles.topSubtitles}>200</Text>*/}
                                {/*</View>*/}
                            </View>

                        </View>

                    </View>


                    <View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: scale(20),
                            paddingHorizontal: scale(18)
                        }}>
                            <Text style={[styles.otherTopLabel, {
                                color: Colors.greyText,
                                fontFamily: 'AvenirLTStd-Heavy',
                            }]}>Select Loan to continue</Text>
                            {this.state.viewType === "list" ?
                                <TouchableOpacity onPress={() => this.changeViewType('grid')}>
                                    <SimpleLineIcons name="grid" size={17} color={"#000"}/>
                                </TouchableOpacity> :
                                <TouchableOpacity onPress={() => this.changeViewType('list')}>
                                    <Ionicons name="ios-list" size={17} color={"#000"}/>
                                </TouchableOpacity>}
                        </View>

                        <View style={{marginTop: scale(10)}}>

                            {this.state.viewType === 'list' && (
                                <FadeInView>
                                    {  this.props.marketData.map(item => {
                                        return <ListViewItem item={item}/>
                                    })}
                                    <ListViewItem item={{
                                        LEGAL_NAME:'Tobe'
                                    }}/>
                                </FadeInView>
                            )}

                            {
                                this.state.viewType !== 'list' && (
                                    <Carousel
                                        ref={(c) => {
                                            this._carousel = c;
                                        }}
                                        // layout={'stack'} layoutCardOffset={`10`}
                                        data={this.props.marketData}
                                        renderItem={this._renderCarouselItem}
                                        sliderWidth={Dimensions.get('window').width - 10}
                                        itemWidth={Dimensions.get('window').width - 60}
                                    />
                                )
                            }
                        </View>
                    </View>

                </ScrollView>
            </View>

        );
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        loanHistory: state.home.loanHistory || [],
        home: state.home || null,
        loading_dashboard: state.market.loading || false,
        marketData: state.market.marketData || [],
        wallet_balance: state.market.wallet_balance || [],
    };
};

const mapDispatchToProps = {
    logoutUserSuccess,
    getMarket
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(HomeScreen));

const styles = StyleSheet.create({
        container: {
            flex: 1
        },
        status: {
            color: Colors.darkBlue,
            fontFamily: 'graphik-regular',
            fontSize: scale(12)
        },
        secondaryHeader: {
            color: Colors.tintColor,
            fontFamily: 'AvenirLTStd-Heavy',
            fontSize: scale(14)
        },
        portfolioHeader: {
            color: Colors.greyText,
            fontFamily: 'graphik-medium',
            fontSize: scale(14),
            marginBottom: scale(13),
            letterSpacing: scale(-0.3)
        },
        amount: {
            color: Colors.tintColor,
            fontFamily: 'graphik-medium',
            fontSize: scale(20),
            letterSpacing: scale(-0.2)
        },
        summaryHeader: {
            color: Colors.white,
            width: '100%',
            textAlign: 'center',
            fontFamily: 'graphik-regular',
            fontSize: scale(12),
            marginBottom: scale(12)
        },
        analyticsContainer: {
            height: scale(75),
            borderRadius: scale(15),
            borderBottomEndRadius: scale(0),
            backgroundColor: 'white',
            flexDirection: 'row',

        },
        inner: {
            height: scale(75),
            // borderRadius: scale(15),
            borderBottomStartRadius: scale(15),
            // borderBottomEndRadius:scale(15),
            width: '50%',
            backgroundColor: '#f1f1f1',
            justifyContent: 'center',
            alignItems: 'center'
        },
        topLabel: {
            color: Colors.white,
            fontFamily: 'AvenirLTStd-Heavy',
            fontSize: scale(14)
        },

        otherTopLabel: {
            color: Colors.white,
            fontFamily: 'graphik-regular',
            fontSize: scale(12)
        },
        topAmount: {
            color: Colors.white,
            fontFamily: 'AvenirLTStd-Heavy',
            fontSize: scale(30),
            letterSpacing: scale(-1)
        },
        topSubtitles: {
            color: Colors.white,
            fontFamily: 'graphik-regular',
            fontSize: scale(20),
            letterSpacing: scale(-1)
        },

        topHeader: {
            flex: 1,
            paddingHorizontal: scale(18),
            paddingBottom: scale(25),
            // flexDirection: 'row',
            alignItems: 'center',
            paddingTop: scale(30),
            // borderBottomEndRadius: scale(27),
            // borderBottomStartRadius: scale(27),
            backgroundColor: '#3F3F97'
        },
        imageContainer: {
            backgroundColor: '#88D7DB',
            height: scale(44),
            width: scale(44),
            borderRadius: scale(22),
            alignItems: 'center',
            justifyContent: 'center'
        },

        date: {
            color: Colors.white,
            fontFamily: 'graphik-medium',
            fontSize: scale(14)
        },

        profilePicture: {
            backgroundColor: 'white',
            height: scale(40),
            width: scale(40),
            borderRadius: scale(20),
            alignItems: 'center',
            justifyContent: 'center'
        },
        welcomeTitle: {
            color: Colors.white,
            fontFamily: 'graphik-medium',
            fontSize: scale(14),
            // marginTop: scale(11)
        },
        //card styles
        card: {
            borderRadius: scale(9),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            // backgroundColor: 'white',
            backgroundColor: "#7676C6",
            shadowOffset: {
                width: 0,
                height: scale(2)
            },
            width: '100%',
            minHeight: scale(300),
            shadowRadius: 4,
            shadowOpacity: 1.0,
            elevation: 1,
            paddingHorizontal: scale(14),
            paddingVertical: scale(16),
            marginBottom:scale(20)
        },
        cardMonthly: {
            borderRadius: scale(6),
            // height: scale(44),
            width: '33%',
            // backgroundColor: '#f0f0f0',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardMonthlyAmount: {
            // color: '#535353',
            color: Colors.white,
            fontFamily: 'AvenirLTStd-Light',
            fontSize: scale(12)
        },
        cardInnerHeader: {
            color: Colors.white,
            fontFamily: 'AvenirLTStd-Heavy',
            fontSize: scale(16),
        },
        cardTitle: {
            color: Colors.white,
            fontFamily: 'AvenirLTStd-Heavy',
            fontSize: scale(18),
            letterSpacing: scale(-0.3)
        },
        cardService: {
            color: Colors.white,
            fontFamily: 'graphik-regular',
            fontSize: scale(12),
        },

    }
);
