import fs from 'fs';
import fetch from 'node-fetch';
import { getCardType } from './utils/cardUtils.js';
import { BEARER_TOKEN, BRAINTREE_URL } from './config/config.js';

async function CC(element) {
  try {
    const [cardNumber, expiryMM, expiryYYYY, cvv] = element.split('|');
    const expiryYY = expiryYYYY.slice(0, 2);
    const ccType = getCardType(cardNumber);

    const requestOptions = {
      method: "POST",
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Braintree-Version': '2018-05-10',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientSdkMetadata: {
          source: "client",
          integration: "custom",
          sessionId: "test-session-id"
        },
        query: `mutation TokenizeCreditCard($input: TokenizeCreditCardInput!) { 
          tokenizeCreditCard(input: $input) { 
            token 
            creditCard { 
              bin brandCode last4 expirationMonth expirationYear 
              binData { 
                prepaid healthcare debit durbinRegulated commercial payroll issuingBank countryOfIssuance productId 
              } 
            } 
          } 
        }`,
        variables: {
          input: {
            creditCard: {
              number: cardNumber,
              expirationMonth: expiryMM,
              expirationYear: expiryYYYY,
              cvv: cvv
            },
            options: { validate: false }
          }
        },
        operationName: "TokenizeCreditCard"
      })
    };

    const response = await fetch(BRAINTREE_URL, requestOptions);
    const data = await response.json();

    if (data.data?.tokenizeCreditCard) {
      console.log(`✅ Card Processed: ${cardNumber} | Type: ${ccType}`);
      console.log(data.data.tokenizeCreditCard.creditCard);
    } else {
      console.error(`❌ Error processing card: ${cardNumber}`, data);
    }
  } catch (error) {
    console.error("⚠️ Error:", error);
  }
}

// Read file and process each card
fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error("❌ Error reading file:", err);
    return;
  }
  
  const list = data.trim().split('\n');
  list.forEach(CC);
});