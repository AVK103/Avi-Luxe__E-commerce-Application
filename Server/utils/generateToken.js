const jwt = require("jsonwebtoken");

const DEFAULT_JWT_EXPIRES_IN = "7d";

/**
 * Generate a signed JWT used for user authentication.
 *
 * @param {object|string|Buffer} payload - Data embedded in the token.
 * @returns {string} Signed JWT.
 * @throws {Error} If JWT_SECRET is missing from environment variables.
 */
const generateToken = (payload) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not set in environment variables.");
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

module.exports = generateToken;
