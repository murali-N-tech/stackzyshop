import jwt from 'jsonwebtoken';
import 'dotenv/config';

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will be valid for 30 days
  });

  return token;
};

export default generateToken;