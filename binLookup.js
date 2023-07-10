function CC(element) {
	let cardNumber, expiryMM, expiryYYYY, cvv, expiryYY, ccType;
	const ccDetails = element.split('|');
	cardNumber = ccDetails[0];
	expiryMM = ccDetails[1];
	expiryYYYY = ccDetails[2];
	cvv = ccDetails[3];

	expiryYY = expiryYYYY.slice(0, 2);
	ccType = getCardType(ccDetails[0]);

	const requestOptions = {
		method: "POST",
		headers: {
			'Accept': '*/*',
			'Authorization': 'Bearer <USE YOUR BEARER VALUE>',
			'Braintree-Version': '2018-05-10',
			'Connection': 'keep-alive',
			'Content-Type': 'application/json',
			'Host': 'payments.braintree-api.com',
			'Origin': 'https://assets.braintreegateway.com',
			'Referer': 'https://assets.braintreegateway.com/',
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'cross-site'
	  	},
	  	body: `{"clientSdkMetadata":{"source":"client","integration":"custom","sessionId":"8c2659f3-1d63-408c-a435-1fdccc20ef1d"},"query":"mutation TokenizeCreditCard($input: TokenizeCreditCardInput!) {   tokenizeCreditCard(input: $input) {     token     creditCard {       bin       brandCode       last4       expirationMonth      expirationYear      binData {         prepaid         healthcare         debit         durbinRegulated         commercial         payroll         issuingBank         countryOfIssuance         productId       }     }   } }","variables":{"input":{"creditCard":{"number":"${cardNumber}","expirationMonth":"${expiryMM}","expirationYear":"${expiryYYYY}","cvv":"${cvv}"},"options":{"validate":false}}},"operationName":"TokenizeCreditCard"}`
	};

	const url = "https://payments.braintree-api.com/graphql";

	fetch(url, requestOptions)
	.then(response => response.json())
	.then(data => {
		console.log(data.data.tokenizeCreditCard.creditCard);
		// console.log('----------------------------------------------------');
	})
}


// Driver
const fs = require('fs');
fs.readFile('input', 'utf8', function(err, data) {
	if (err) throw err;
	// Format of list - CardNumber|MM|YYYY|CVV
	const list = data.trim().split('\n');
	list.forEach(CC);
});

// Function to find type of CC
function getCardType(cardNumber) {
	// Remove all non-digit characters from the card number
  	const cleanedNumber = cardNumber.replace(/\D/g, '');

  	// Define the regular expressions for each card type
  	const cardTypes = {
    	Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    	MasterCard: /^5[1-5][0-9]{14}$/,
    	AmericanExpress: /^3[47][0-9]{13}$/,
    	Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    	DinersClub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    	JCB: /^(?:2131|1800|35\d{3})\d{11}$/
  	};

  	// Check each card type regular expression against the cleaned card number
  	for (let [cardType, pattern] of Object.entries(cardTypes)) {
    	if (pattern.test(cleanedNumber)) {
      		return cardType;
    	}
  	}

  	// If no card type matches, return "Unknown"
  	return 'Unknown';
}
