import dotenv from 'dotenv';

dotenv.config();

export const BEARER_TOKEN = process.env.BEARER_TOKEN;
export const BRAINTREE_URL = "https://payments.braintree-api.com/graphql";