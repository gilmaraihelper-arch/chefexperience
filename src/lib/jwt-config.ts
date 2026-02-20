// JWT Configuration
// JWT_SECRET must be defined in environment variables

export const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required. Please set it in your .env file.');
  }
  
  return secret;
})();

export const JWT_EXPIRES_IN = '15m';
export const REFRESH_TOKEN_EXPIRES_IN = '7d';
