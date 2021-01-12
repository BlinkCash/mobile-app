import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from "../../lib/constants/Colors";
import { scale } from "../../lib/utils/scaleUtils";
import { Rating } from "react-native-elements";
import TouchItem from "../../components/TouchItem/_TouchItem";


export const STAR_IMAGE = require("../../../assets/images/starIcon/star.png");

export default (props) => {
    let loan = props.item;
    return <TouchItem style={styles.container}>
        <View>
            <Text style={styles.title}>{loan.LEGAL_NAME}</Text>
            <Text style={styles.subtitle}>{loan.WORK_SECTOR}</Text>
            <Rating
                type="custom"
                fractions={1}
                readonly
                ratingImage={STAR_IMAGE}
                startingValue={loan.PEOPLE_RATING_ID}
                ratingColor={Colors.tintColor}
                ratingBackgroundColor='#ffffff'
                ratingCount={5}
                imageSize={13}
                style={{backgroundColor: 'red', textAlign: 'left', alignSelf: 'flex-start'}}
            />
        </View>
        <View>
            <Text style={styles.amount}>₦{loan.REQUEST_PRINCIPAL}</Text>
        </View>
    </TouchItem>
}

const styles = StyleSheet.create({

        container: {
            borderBottomWidth: scale(0.7),
            borderBottomColor: 'rgba(151,151,151,20)',
            paddingHorizontal: scale(18),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scale(11)
        },
        title: {
            color: Colors.greyText,
            fontFamily: 'AvenirLTStd-Heavy',
            fontSize: scale(14),
            marginBottom: scale(3),
            letterSpacing: scale(-0.3)
        },
        subtitle: {
            color: Colors.greyText,
            fontFamily: 'graphik-regular',
            fontSize: scale(12),
            marginBottom: scale(3),
            // marginTop: scale(11)
        },
        amount: {
            color: Colors.greyText,
            fontFamily: 'AvenirLTStd-Heavy',
            fontSize: scale(15),
            // marginBottom: scale(3),
            // marginTop: scale(11)
        }

    }
);
