function formattedMoney(number) {
    let reversedNumber = number.split('').reverse().join('');
    let formattedNumber = reversedNumber.replace(/(\d{3})(?!$)/g, '$1.');
    formattedNumber = formattedNumber.split('').reverse().join('');

    return formattedNumber;
}

module.exports = { formattedMoney }