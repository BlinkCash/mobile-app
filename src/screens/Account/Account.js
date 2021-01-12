import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { AsyncStorage, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { logoutUserSuccess } from "../Auth/action/auth_actions";
import { connect } from 'react-redux';
import { withNavigationFocus } from "react-navigation";
import { scale } from "../../lib/utils/scaleUtils";
import FadeInView from "../../components/AnimatedComponents/FadeInView";
import * as Icon from '@expo/vector-icons'
import { Colors } from "../../lib/constants/Colors";
import _TouchItem from '../../components/TouchItem/_TouchItem';
import { ButtonWithBackgroundBottom, ButtonWithBackgroundText } from "../../components/Button/Buttons";

class SettingsScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props)

        const accountItems = [
            {
                name: "View all service requests",
                id: 1,
                urlName: "ServiceRequests"
            }
        ]

        this.state = {
            accountItems
        }
    }

    _signOutAsync = async () => {
        this.props.logoutUserSuccess();
        AsyncStorage.removeItem('access_token');
        this.props.navigation.navigate('Login');
    };

    render() {
        let profileImage = ''
        if (this.props.auth.profileImage) {
            profileImage = {uri: this.props.auth.profileImage}
        }
        return <View style={styles.container}>
            <View style={styles.topHeader}>
                <FadeInView>
                    <_TouchItem onPress={() => this.props.navigation.navigate('EditProfile')}>
                        {!!profileImage && (
                            <Image
                                style={{
                                    height: scale(40),
                                    width: scale(40),
                                    borderRadius: scale(20),
                                }}
                                //{/*{...{preview, ...background}}*/}
                                source={profileImage}
                                borderRadius={scale(20)}
                                resizeMode={"cover"}
                            />
                        )}
                        {!profileImage && (
                            <View style={styles.image}>
                                <Text
                                    style={styles.initials}>{`${this.props.auth.firstName[0].toUpperCase()}${this.props.auth.lastName[0].toUpperCase()}`}</Text>
                            </View>
                        )}
                    </_TouchItem>
                </FadeInView>
                <View style={{flex: 1}}>
                    <Text style={styles.title} numberOfLines={1}>Account</Text>
                </View>
                <View style={{width: scale(40)}}/>
            </View>
            {this.state.accountItems.map((sectionItem, i) => (
                <View
                    style={styles.itemContainerBorder}
                    key={sectionItem.id}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate(sectionItem.urlName)}>
                        <View style={styles.listItem}>
                            <Text style={styles.sectionItemText}>{sectionItem.name}</Text>
                            <Icon.Ionicons
                                name="ios-arrow-forward"
                                size={scale(25)}
                                style={styles.itemArrow}
                                color="rgba(0, 0, 0, 0.25)"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            ))}
            <View style={{marginHorizontal: scale(20), flex:1, marginTop: scale(25) }}>
                <ButtonWithBackgroundBottom
                    onPress={() => this._signOutAsync()}
                    style={styles.secondaryButtonStyle}

                >
                    <ButtonWithBackgroundText style={{color: Colors.tintColor}}>Sign Out</ButtonWithBackgroundText>
                </ButtonWithBackgroundBottom>
            </View>
        </View>;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        properties: state.home.properties || [],
        loading_properties: state.home.loading || false,
    };
};

const mapDispatchToProps = {logoutUserSuccess};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(SettingsScreen));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddd',
    },
    topHeader: {
        backgroundColor: '#055DA2',
        height: scale(60),
        paddingHorizontal: scale(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    image: {
        backgroundColor: 'white',
        height: scale(40),
        width: scale(40),
        borderRadius: scale(20),
        alignItems: 'center',
        justifyContent: 'center'
    },
    initials: {
        color: Colors.greyText,
        fontFamily: 'graphik-medium',
        fontSize: scale(18),
    },
    title: {
        fontSize: scale(20),
        fontFamily: 'graphik-medium',
        // paddingLeft: scale(19),
        color: Colors.white,
        textAlign: 'center'
    },
    itemContainerBorder: {
        paddingHorizontal: scale(15),
        // marginRight: scale(15),
        borderBottomWidth: 1,
        backgroundColor:Colors.white,
        marginTop:scale(20),
        borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: scale(50),
    },
    itemArrow: {
        paddingRight: scale(15)
    },
    sectionItemText: {
        fontSize: scale(16),
        fontFamily:'graphik-regular',
        textAlign: 'left',
        color: Colors.greyText
    },
    secondaryButtonStyle: { backgroundColor: Colors.white, borderColor: Colors.tintColor, borderWidth: 1},
})
