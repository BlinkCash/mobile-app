import React, { Component } from 'react';

import {
    Text,
    View,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableHighlight,
    FlatList,
    PanResponder, TextInput, TouchableOpacity
} from 'react-native';
import Modal from "react-native-modal";


import { scale, verticalScale } from "../../lib/utils/scaleUtils";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';


class Dropdown extends Component {

    constructor(props) {

        super(props);

        this.state = {
            // showModal: true,
            searchTerm: '',
            options: [],
            filteredOptions: []
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.setValue = this.setValue.bind(this);
    }

    componentDidMount() {
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

        let options = this.state.searchTerm ? [...this.state.filteredOptions] : [...this.state.options]
        let optionItems = options.map((item, index) => {
            let icon = {uri: item.imageUrl}

            return (
                <TouchableHighlight key={index} underlayColor="#f7f7f7" activeOpacity={0.75}
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
                        <View>
                            <Text style={[styles.options, {...this.props.optionsStyle}]}>{item.label}</Text>
                            <Text
                                style={[styles.optionsTitle, {...this.props.optionsStyle}]}>{item.value.customerId}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            );
        });


        return (
            <View style={[styles.container, this.props.style]}>
                <Modal
                    animationIn={'slideInUp'}
                    onBackdropPress={() => this.closeModal()}
                    isVisible={this.props.show}
                    style={{margin: 0}}
                >
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
                                paddingLeft: scale(20),
                                paddingRight: scale(5),
                            }}>
                                <Text style={styles.title}>{this.props.title}</Text>
                                <TouchableOpacity onPress={this.closeModal} style={{paddingLeft: 15, paddingRight: 15}}>
                                    <Ionicons name='ios-close'
                                              size={scale(30)}
                                              color={'rgba(0, 0, 0, 0.5400000214576721)'}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                width: '100%', paddingLeft: scale(20),
                                paddingRight: scale(20), paddingTop: scale(20)
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
                        {/*<ScrollView*/}
                        {/*style={{*/}
                        {/*// maxHeight: verticalScale(400),*/}
                        {/*// borderRadius: 0,*/}
                        {/*elevation: 2,*/}
                        {/*minWidth: scale(300),*/}
                        {/*// width: '100%',*/}
                        {/*// flex: 1,*/}
                        {/*paddingLeft: scale(20),*/}
                        {/*paddingRight: scale(20),*/}
                        {/*backgroundColor: 'white'*/}
                        {/*}}*/}
                        {/*contentContainerStyle={{backgroundColor: "white"}}*/}
                        {/*scrollEnabled={true}*/}
                        {/*keyboardShouldPersistTaps={'always'}*/}
                        {/*enableOnAndroid={true}*/}
                        {/*>*/}
                        {/*{optionItems}*/}
                        {/*</ScrollView>*/}

                        <View
                            style={{
                                // maxHeight: verticalScale(400),
                                // borderRadius: 0,
                                elevation: 2,
                                minWidth: scale(300),
                                // width: '100%',
                                // flex: 1,
                                paddingLeft: scale(20),
                                paddingRight: scale(20),
                                backgroundColor: 'white'
                            }}
                        >
                            <FlatList
                                data={options}
                                renderItem={({item, index}) => {
                                    let icon = {uri: item.imageUrl}

                                    return (
                                        <TouchableHighlight key={index} underlayColor="#f7f7f7" activeOpacity={0.75}
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
                                                <View>
                                                    <Text
                                                        style={[styles.options, {...this.props.optionsStyle}]}>{item.label}</Text>
                                                    <Text
                                                        style={[styles.optionsTitle, {...this.props.optionsStyle}]}>{item.value.customerId}</Text>
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    );
                                }}
                                keyExtractor={item => item.id}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    setValue(valueObj) {
        this.setState({
            showModal: false,
            searchTerm: '',
            filteredOptions: [],
        }, () => {
            this.props.close();
        })

        if (this.props.onChange) {
            this.props.onChange(valueObj);
        }
    }

    openModal() {
        if (this.props.disabled) return;
        this.setState({
            showModal: true
        })
    }

    closeModal() {
        this.setState({
            showModal: false,
            searchTerm: '',
            filteredOptions: []
        }, () => {
            this.props.close()
        })
    }

    onSearchChange = (searchTerm) => {
        let options = [...this.state.options]
        let filteredOptions = options.filter((option) => {
            let label = option.label || ''
            return label.includes(searchTerm) || option.value.customerId.includes(searchTerm)
        })

        this.setState({
            filteredOptions,
            searchTerm
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
        width: 100,
        alignItems: "center"
    },
    text: {
        // flex: 1,
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
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
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
        fontFamily: 'graphik-regular'
    },
    optionsTitle: {
        color: 'rgba(0, 0, 0, 0.8700000047683716)',
        fontFamily: 'graphik-regular',
        fontSize: scale(16),

    },
    image: {
        height: 8,
        width: 8
    }
}


export default Dropdown; 
