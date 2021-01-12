import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import env from '../../../env.js';
import web from './web'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";



const paystackKey = env()._payStackApiKeys;
// const webapp = require('./sdsds.html');



class PaystackWebview extends Component {

    state = {
        jsLoaded: false,
        verified:false
    }

    componentDidMount  () {

        // this.webviewIOS.injectJavaScript(`lawyrPayOptions = ${JSON.stringify(this.props.options)};`);
    }

    closeModalError = () => {
        // this.props.hidePaystackView();
        alert('Paystack not loaded');
    }


    handleWebViewNavigationStateChange = newNavState => {

        const runFirst = `
     let rootElement = document.querySelector("body");
rootElement.addEventListener(
  "click",
  function(event) {
    let targetElement = event.target;

    while (targetElement != null) {
      if (targetElement.nodeName === "BUTTON") {
        //logic for handling the click event of li tag
        

        if (targetElement.innerHTML.includes("Cancel")) {
        
          window.ReactNativeWebView.postMessage("cancel");
        }
        return;
      }
      targetElement = targetElement.parentElement;
    }
  },
  true
);

      true; // note: this is required, or you'll sometimes get silent failures
    `;
        // newNavState looks something like this:
        // {
        //   url?: string;
        //   title?: string;
        //   loading?: boolean;
        //   canGoBack?: boolean;
        //   canGoForward?: boolean;
        // }
        console.log(newNavState)
        const {url, title} = newNavState;
        if (!url) return;



        if(title.includes("Paystack")){
            this.webview.injectJavaScript(runFirst)
        }

        if(this.state.verified) return
        // return if you've verified card at least once.
        if (url.includes('lendsqr.com')) {
            this.webview.stopLoading();
            let reference = getParameterByName('reference', url);
            let trxref = getParameterByName('trxref', url);

            console.log(reference)
            console.log(trxref)
            console.log(url)
            this.setState({
                verified:true
            }, () => {
                this.props.verifyCard()
            })
            // maybe close this view?
        }else if(url.includes('standard.paystack.co/close')){
            this.webview.stopLoading();
            this.setState({
                verified:true
            }, () => {
                this.props.verifyCard()
            })
        }

    }
    onPaystackMessage = event => {
        if(event.nativeEvent.data === 'cancel'){
            this.props.close();
        }
    }

    render() {

        const runFirst = `
     let rootElement = document.querySelector("body");
rootElement.addEventListener(
  "click",
  function(event) {
    let targetElement = event.target;

    while (targetElement != null) {
      if (targetElement.nodeName === "BUTTON") {
        //logic for handling the click event of li tag
        
        alert("here");

        if (targetElement.innerHTML.includes("Cancel")) {
        
          window.ReactNativeWebView.postMessage("cancel");
        }
        return;
      }
      targetElement = targetElement.parentElement;
    }
  },
  true
);

      true; // note: this is required, or you'll sometimes get silent failures
    `;

        return (
            <View style={{flex: 1}}>
                <WebView
                    source={{uri: this.props.url}}
                    ref={ref => (this.webview = ref)}
                    originWhitelist={['*']}
                    onNavigationStateChange={this.handleWebViewNavigationStateChange}
                    startInLoadingState
                    onShouldStartLoadWithRequest={() => true}
                    javaScriptEnabled={true}
                    onError={this.closeModalError}
                    domStorageEnabled={true}
                    ignoreSslError={true}
                    mixedContentMode={'always'}
                    thirdPartyCookiesEnabled={true}
                    style={styles.theView}
                    sharedCookiesEnabled={true}
                    injectedJavaScriptBeforeContentLoaded={runFirst}
                    onMessage={this.onPaystackMessage}
                    useWebKit
                    allowUniversalAccessFromFileURLs={true}
                    scrollEnabled={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    theView: {
        backgroundColor:'white'
        // flex: 0,
        // width: deviceWidth,
        // height: deviceHeight
    }
})

const mapDispatchToProps = (dispatch) => {
    return {
        // handleTransactionVerification: (reference_no, token, id) => dispatch(handleTransactionVerification(reference_no, token,id)),
        // hidePaystackView: () => dispatch(hidePaystackView())
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PaystackWebview);

const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}