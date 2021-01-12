import React, { FC, useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, Text, TextStyle, TextInput } from 'react-native';
import styles from './styles';
import { formatAmount } from "../../lib/utils/helpers";

const VALID = /^[1-9]{1}[0-9]*$/;


const CurrencyInput = ({
                           max = Number.MAX_SAFE_INTEGER,
                           onValueChange,
                           style = {marginBottom: 0},
                           value
                       }) => {
    const valueAbsTrunc = Math.trunc(Math.abs(value));
    if (value !== valueAbsTrunc || !Number.isFinite(value) || Number.isNaN(value)) {
        throw new Error(`invalid value property`);
    }
    const [inputHeight, setInputHeight] = useState(0);
    const [inputWidth, setInputWidth] = useState(0);
    const handleChangeText = useCallback((text) => {
        if (text === '') {
            onValueChange(0);
            return;
        }
        if (!VALID.test(text)) {
            return;
        }
        const nextValue = parseInt(text, 10);
        if (nextValue > max) {
            return;
        }
        onValueChange(nextValue);
    }, []);
    const handleLayout = useCallback((event) => {
        const {height, width} = event.nativeEvent.layout;
        setInputHeight(height);
        setInputWidth(width);
    }, []);
    const valueInput = value === 0 ? '' : value.toString();
    // const valueDisplay = (value / 100).toLocaleString('en-US', {
    //     maximumFractionDigits:2,
    //     style: 'currency',
    //     currency: 'NGN'
    // });
    const valueDisplay = formatAmount(value)
    const {marginBottom} = StyleSheet.flatten(style);

    return (
        <>
            <Text onLayout={handleLayout} style={[style, styles.text]}>
                {valueDisplay}
            </Text>
            <TextInput
                contextMenuHidden
                autoFocus
                // selection={{start: 100,end: 100}}
                keyboardType="numeric"
                onChangeText={handleChangeText}
                value={valueInput}
                style={[
                    styles.input,
                    {
                        height: inputHeight,
                        marginBottom,
                        marginTop: -1 * inputHeight,
                        width: inputWidth
                    }
                ]}
            />
        </>
    );
};

export default CurrencyInput;