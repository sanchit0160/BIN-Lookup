export function getCardType(cardNumber) {
    const cleanedNumber = cardNumber.replace(/\D/g, '');
    const cardTypes = {
        Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        MasterCard: /^5[1-5][0-9]{14}$/,
        AmericanExpress: /^3[47][0-9]{13}$/,
        Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        DinersClub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        JCB: /^(?:2131|1800|35\d{3})\d{11}$/
    };

    return Object.keys(cardTypes).find(type => cardTypes[type].test(cleanedNumber)) || 'Unknown';
}
