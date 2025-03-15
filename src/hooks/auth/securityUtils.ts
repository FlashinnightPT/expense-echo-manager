
import bcryptjs from 'bcryptjs';

/**
 * Hashes a password using bcrypt
 * @param password Plain text password to hash
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed password
 * @param password Plain text password to check
 * @param hashedPassword Hashed password to compare against
 * @returns Boolean indicating if passwords match
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcryptjs.compare(password, hashedPassword);
};

/**
 * Generates a random authentication token
 * @returns Random token string
 */
export const generateAuthToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

/**
 * Validates an authentication token
 * @param token Token to validate
 * @param storedToken Token stored in the system
 * @returns Boolean indicating if token is valid
 */
export const validateToken = (token: string, storedToken: string): boolean => {
  return token === storedToken;
};
