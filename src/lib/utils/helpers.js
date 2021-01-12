export const formatAmount = (num) => {
    if(+num){
        return parseFloat(num).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }else{
        return '0'
    }

};

export const chunkArray = (array, size) => {
    const chunked = [];
    let index = 0;

    while(index < array.length){
        chunked.push(array.slice(index, index + size))
        index += size
    }

    return chunked
}

export function roundTo2dP(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}
  

export function convertDecimal(number) {
    console.log(number, '******>>>>>>')
    number = number ? `${roundTo2dP(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : '0.00';
    number = number.split('.')[1] ? number.split('.')[1].length > 1 ? number : `${number}0` : `${number}.00`;
    return number;
}