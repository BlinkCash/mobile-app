import React, { Component } from 'react';

import {
    Text,
    View,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableHighlight,
    PanResponder, TextInput, TouchableOpacity
} from 'react-native';
import Modal from "react-native-modal";
import { scale, verticalScale } from "../../lib/utils/scaleUtils";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TouchItem from "../TouchItem/_TouchItem";


class Dropdown extends Component {

    constructor(props) {

        super(props);

        this.state = {
            showModal: false,
            searchTerm: '',
            options: [],
            filteredOptions: []
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.setValue = this.setValue.bind(this);
    }

    componentDidMount() {
        if(this.props.showModal){
            console.log(this.props.showModal)
            this.setState({
                showModal:true
            })
        }
        this.setState({
            options: this.props.options
        })
    }

    componentDidUpdate(prevProps) {
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.options.length !== nextProps.options.length) {
            this.setState({
                options: nextProps.options
            })
        }

    }

    render() {

        let optionItems = [];
        let options = this.state.searchTerm ? [...this.state.filteredOptions] : [...this.state.options]
        optionItems = options.map((item) => {
            let icon = {uri: item.imageUrl}


            return (
                <TouchableHighlight key={item.value} underlayColor="#f7f7f7" activeOpacity={0.75}
                                    onPress={() => {
                                        this.setValue(item)
                                    }}
                >
                    <View style={{
                        borderBottomColor: '#eee',
                        borderBottomWidth: 1,
                        height: scale(50),
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        {
                            !!item.imageUrl && (<Image
                                style={{
                                    width: scale(30),
                                    height: scale(30),
                                    marginLeft: scale(10),
                                    marginRight: scale(10),
                                    marginTop: scale(10),
                                    marginBottom: scale(10),
                                    borderRadius: scale(5)
                                }}
                                source={icon}
                                resizeMode={'contain'}
                            />)
                        }
                        {/*{*/}
                        {/*!item.imageUrl && (<Image*/}
                        {/*style={{*/}
                        {/*width: scale(30),*/}
                        {/*height: scale(30),*/}
                        {/*marginLeft: scale(10),*/}
                        {/*marginRight: scale(10),*/}
                        {/*marginTop: scale(10),*/}
                        {/*marginBottom: scale(10),*/}
                        {/*borderRadius: scale(5)*/}
                        {/*}}*/}
                        {/*source={{uri: whiteImage}}*/}
                        {/*resizeMode={'contain'}*/}
                        {/*/>)*/}
                        {/*}*/}
                        <View style={{flex:1, paddingRight: scale(20)}}>
                            <Text numberOfLines={1}
                                  style={[styles.optionsTitle, {...this.props.optionsStyle}]}>{item.label}</Text>
                            {item.subtitle && (
                                <Text
                                    style={[styles.options, {...this.props.optionsStyle}]}>{item.subtitle}</Text>
                            )}

                        </View>
                    </View>
                </TouchableHighlight>
            );
        });


        let text = '';
        let imageUrl = this.props.value.imageUrl;
        let textColor = "";
        if (this.props.value.code) {
            text = this.props.value.code
        }
        if (this.props.value.label) {
            text = this.props.value.label
        }

        else if (this.props.value.label == "" && this.props.placeholder) {
            text = this.props.placeholder;
            textColor = this.props.placeholderColor ? this.props.placeholderColor : "#aaa";
        } else if (this.props.value.label == "") {
            text = "";
        } else {
            text = this.props.value.label;
            if (this.props.textStyle) {
                textColor = this.props.textStyle.color ? this.props.textStyle.color : "#666";
            } else {
                textColor = "#666";
            }

        }


        let textStyle = {...this.props.textStyle};
        if (textColor) {
            textStyle.color = textColor;
        }

        let icon = {uri: this.props.value.imageUrl}

        if (!!this.props.value.hardCodedImage) {
            if (!!this.props.value.bankImage) {
                icon = banks[this.props.value.imageUrl] || banks[this.props.value.defaultImg]
            }
        } else {
            icon = {uri: this.props.value.imageUrl}
        }

        return (
            <View style={[styles.container, this.props.style]}>
                <TouchItem onPress={this.openModal}>
                    {this.props.children}
                    <View style={[{
                        position:'absolute',
                        right:0,
                        top:scale(15)
                    },this.props.dropdownImageStyle]}>
                        <MaterialIcons name={this.state.showModal ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                       size={scale(20)}
                                       color={'#666'}/>
                    </View>
                </TouchItem>
                {this.state.showModal && (
                    <Modal
                        // animationType={"fade"}
                        // transparent={true}
                        // onRequestClose={this.closeModal}
                        // onSwipe={() => this.closeModal()}
                        // swipeDirection="down"

                        animationIn={'slideInUp'}
                        onBackdropPress={() => this.closeModal()}
                        isVisible={this.state.showModal}
                        style={{margin: 0}}
                    >
                        {/*<View style={{*/}
                        {/*backgroundColor: "rgba(0,0,0, 0.75)",*/}
                        {/*flex: 1,*/}
                        {/*}}>*/}
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            top: verticalScale(218),
                            borderTopLeftRadius: scale(10),
                            borderTopRightRadius: scale(10),
                            backgroundColor: "white",
                            // height: '100%'
                        }}>
                            <View style={{}}>
                                <View style={{
                                    height: scale(48),
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#eee',
                                    paddingLeft: 20,
                                    paddingRight: 5,
                                }}>
                                    <Text style={styles.title}>{this.props.title}</Text>
                                    <TouchItem onPress={this.closeModal}
                                               style={{paddingLeft: 15, paddingRight: 15}}>
                                        <Ionicons name='ios-close'
                                                  size={scale(30)}
                                                  color={'rgba(0, 0, 0, 0.5400000214576721)'}/>
                                    </TouchItem>
                                </View>
                                <View style={{
                                    width: '100%', paddingLeft: 20,
                                    paddingRight: 20, paddingTop: 20
                                }}>
                                    <TextInput
                                        style={[styles.search]}
                                        underlineColorAndroid={'transparent'}
                                        placeholder={'Search'}
                                        onChangeText={this.onSearchChange}
                                        value={this.state.searchTerm}
                                        multiline={false}
                                        autoCorrect={false}
                                    />
                                </View>
                            </View>
                            {!!this.props.loading && (
                                <Text style={[styles.otherTitle, {paddingLeft: 20}]}>Loading..</Text>
                            )}
                            {this.props.options.length === 0 && !this.props.loading && (
                                <Text style={[styles.otherTitle, {paddingLeft: 20}]}>No Items</Text>
                            )}
                            <ScrollView
                                style={{
                                    // maxHeight: verticalScale(400),
                                    // borderRadius: 0,
                                    elevation: 2,
                                    minWidth: scale(300),
                                    width: '100%',
                                    // flex: 1,
                                    paddingLeft: scale(20),
                                    paddingRight: scale(20),
                                    backgroundColor: 'white'
                                }}
                                contentContainerStyle={{backgroundColor: "white"}}
                                scrollEnabled={true}
                                keyboardShouldPersistTaps={'always'}
                                enableOnAndroid={true}
                            >
                                {optionItems}
                            </ScrollView>
                        </View>
                        {/*</View>*/}
                    </Modal>
                )}
            </View>
        );
    }

    setValue(valueObj) {
        this.setState({
            showModal: false,
            searchTerm: '',
            filteredOptions: []
        })

        if (this.props.onChange) {
            this.props.onChange(valueObj);
        }
    }

    openModal() {
        if (this.props.disabled){
            this.props.disableFunction && this.props.disableFunction()
            return
        }
        this.setState({
            showModal: true
        })
    }

    closeModal() {
        this.setState({
            showModal: false,
            searchTerm: '',
            filteredOptions: []
        })

        if(this.props.closeModal){
            this.props.closeModal()
        }

    }

    onSearchChange = (searchTerm) => {
        let options = [...this.state.options]
        let filteredOptions = options.filter((option) => {
            return option.label.toLowerCase().includes(searchTerm.toLowerCase())
        })

        this.setState({
            filteredOptions,
            searchTerm
        })

    }
}


let styles = {
    container: {},
    text: {
        fontSize: scale(16)
    },
    search: {
        borderColor: '#efefef',
        borderWidth: 1,
        height: scale(48),
        fontSize: scale(14),
        width: '100%',
        marginBottom: 20,
        letterSpacing: scale(-0.3),
        color: 'rgba(0, 0, 0, 0.699999988079071)',
        fontFamily: 'graphik-regular',
        borderRadius: scale(5),
        paddingLeft: scale(10),
        paddingRight: scale(10),
        backgroundColor: '#EFF2F7',
        alignItems: 'center',
        justifyContent: 'center',
        // flex:1
    },
    title: {
        color: '#00425F',
        fontFamily: 'graphik-regular',
        fontSize: scale(16),
        letterSpacing: scale(-0.3)
    },
    options: {
        fontSize: scale(12),
        color: 'rgba(0, 0, 0, 0.5400000214576721)',
        fontFamily: 'graphik-regular',
        width: '90%'
    },
    optionsTitle: {
        color: 'rgba(0, 0, 0, 0.8700000047683716)',
        fontFamily: 'graphik-regular',
        fontSize: scale(16)
    },
    image: {
        height: 8,
        width: 8
    }
}


export default Dropdown; 
