import express from 'express';
import ImageKit from 'imagekit';

const router = express.Router();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

router.get('/imagekit', (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

export default router;