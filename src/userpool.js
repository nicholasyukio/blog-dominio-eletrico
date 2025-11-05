// src/auth/userpool.js
import { CognitoUserPool } from "amazon-cognito-identity-js";

// In Next.js, environment variables must start with NEXT_PUBLIC_
// if they need to be available on the client (browser) side.
const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
  ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
};

export default new CognitoUserPool(poolData);
