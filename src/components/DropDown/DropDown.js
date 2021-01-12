import React, { Component } from 'react';

import {
    Text,
    View,
    Modal,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableHighlight,
    PanResponder
} from 'react-native';

import banks from '../../../assets/images/banks/banks';
import cards from '../../../assets/images/cards/cards';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {scale} from "../../lib/utils/scaleUtils";


class Dropdown extends Component {

    constructor(props) {

        super(props);

        this.state = {
            showModal: false,
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.setValue = this.setValue.bind(this);
    }

    componentDidMount(){
    }

    render() {

        let optionItems = [];
        if (this.props.options) {
            optionItems = this.props.options.map((item) => {
                let icon = {uri: item.imageUrl}

                if(!!item.hardCodedImage){
                    if(!!item.bankImage){
                        icon = banks[item.imageUrl] || banks[item.defaultImg]
                    }else if(!!item.cardImage){
                        icon = cards[item.imageUrl]
                        // icon = require("../../assets/images/cards/master.png")
                    }
                }else{
                    icon = {uri: item.imageUrl}
                }

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
                                        // position: 'absolute',
                                        // top:10,
                                        // right:5,
                                        borderRadius: scale(5)
                                    }}
                                    source={icon}
                                    resizeMode={'contain'}
                                />)
                            }
                            <Text style={[styles.options, {...this.props.optionsStyle}]}>{item.label}</Text>

                        </View>
                    </TouchableHighlight>
                );
            });
        }


        let text = this.props.value.label;
        let imageUrl = this.props.value.imageUrl;
        let textColor = "";
        if (this.props.value.code) {
            text = this.props.value.code
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

        if(!!this.props.value.hardCodedImage){
            if(!!this.props.value.bankImage){
                icon = banks[this.props.value.imageUrl] || banks[this.props.value.defaultImg]
            }
        }else{
            icon = {uri: this.props.value.imageUrl}
        }

        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableWithoutFeedback onPress={this.openModal}>
                    <View style={{
                        flexDirection: 'row',
                        height: '100%',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            {
                                !!imageUrl && (<Image
                                    style={{
                                        width: scale(30),
                                        height: scale(30),
                                        marginRight: scale(10),
                                        marginTop: scale(10),
                                        marginBottom: scale(10),
                                        borderRadius: scale(5)
                                    }}
                                    source={icon}
                                />)
                            }
                            <Text style={[styles.text, {...textStyle}]}>{text}</Text>
                        </View>
                        <View style={[this.props.dropdownImageStyle]}>
                            <MaterialIcons name={this.state.showModal ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                           size={scale(20)}
                                           color={'#666'}/>
                        </View>
                        {/*<Image source={require('../../../assets/icons/dropdown_arrow_64.png')} style={[styles.image, this.props.dropdownImageStyle]}/>*/}
                    </View>
                </TouchableWithoutFeedback>
                <Modal animationType={"fade"} transparent={true} onRequestClose={this.closeModal}
                       visible={this.state.showModal} style={{}}>
                    <TouchableWithoutFeedback onPress={this.closeModal}>
                        <View style={{backgroundColor: "rgba(0,0,0, 0.75)", flex: 1, justifyContent: "center"}}>

                        </View>
                    </TouchableWithoutFeedback>

                    <View style={{padding: scale(10), backgroundColor: "rgba(0,0,0, 0.75)"}}>
                        <ScrollView style={{
                            maxHeight: scale(300),
                            backgroundColor: "white",
                            borderRadius: 0,
                            elevation: 2,
                            minWidth: scale(300),
                            maxWidth: scale(350),
                            alignSelf: 'center'
                        }}>
                            {optionItems}
                        </ScrollView>
                    </View>

                    <TouchableWithoutFeedback onPress={this.closeModal}>
                        <View style={{backgroundColor: "rgba(0,0,0, 0.75)", flex: 1, justifyContent: "center"}}>

                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }

    setValue(valueObj) {
        this.setState({
            showModal: false
        })

        if (this.props.onChange) {
            this.props.onChange(valueObj);
        }
    }

    openModal() {
        if(this.props.openModal){
            this.props.openModal();
        }
        if(this.props.disabled) return;
        this.setState({
            showModal: true
        })
    }

    closeModal() {
        this.setState({
            showModal: false
        })
    }
}


let styles = {
    container: {
        flexDirection: "row",
        marginBottom: scale(40),
        // marginRight: 15,
        borderBottomColor: '#aaa',
        borderBottomWidth: 1,
        // paddingTop: 7,
        // paddingBottom: 7,
        width: scale(100),
        alignItems: "center"
    },
    text: {
        // flex: 1,
        fontSize: scale(16)
    },
    options: {
        fontSize: scale(16),
        color: '#484848',
        fontFamily: 'graphik-regular',
        paddingLeft: scale(20),
        paddingRight: scale(20),
    },
    image: {
        height: scale(8),
        width: scale(8)
    }
}


export default Dropdown; 
