const configureCloudinary = require('../lib/cloudinary');

function signUpload(req, res) {
  try {
    const cloudinary = configureCloudinary();
    const { folder = 'futuregpt/team', public_id, eager = '', invalidate = false } = req.body || {};

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { folder, timestamp };
    if (public_id) paramsToSign.public_id = public_id;
    if (eager) paramsToSign.eager = eager;
    if (invalidate) paramsToSign.invalidate = true;

    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

    res.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      folder,
      signature,
      ...(public_id ? { public_id } : {}),
      ...(eager ? { eager } : {}),
      ...(invalidate ? { invalidate: true } : {}),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to sign upload' });
  }
}

module.exports = { signUpload };


