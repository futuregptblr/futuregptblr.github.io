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

function signResumeUpload(req, res) {
  try {
    const cloudinary = configureCloudinary();
    const { public_id, timestamp: clientTimestamp } = req.body || {};
    const folder = 'futuregpt/resumes';
    
    // Use client timestamp if provided, otherwise generate new one
    const timestamp = clientTimestamp || Math.round(Date.now() / 1000);
    
    // Build parameters in the exact order Cloudinary expects
    const paramsToSign = { 
      folder, 
      timestamp,
      resource_type: 'raw' // For PDF files
    };
    
    if (public_id) paramsToSign.public_id = public_id;

    // Generate signature using Cloudinary's utility function
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

    const response = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      folder,
      signature,
      resource_type: 'raw',
      ...(public_id ? { public_id } : {}),
    };

    res.json(response);
  } catch (err) {
    console.error('Sign resume upload error:', err);
    res.status(500).json({ message: 'Failed to sign resume upload' });
  }
}

module.exports = { signUpload, signResumeUpload };


// Server-side upload using Cloudinary SDK (no client signature needed)
// Expects a multipart/form-data upload with field name "file"
async function uploadResume(req, res) {
  try {
    const cloudinary = configureCloudinary();
    const file = req.file; // multer puts the file here
    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const folder = 'futuregpt/resumes';
    const now = Math.round(Date.now() / 1000);
    const original = file.originalname || 'resume.pdf';
    const match = original.match(/\.([A-Za-z0-9]+)$/);
    const ext = match ? `.${match[1].toLowerCase()}` : '.pdf';
    const baseName = original.replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9_-]+/g, '_');
    const nameWithExt = `resume_${now}_${baseName}${ext}`;

    // For raw files like PDFs, use resource_type: 'raw'
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: nameWithExt,
          resource_type: 'raw',
          access_mode: 'public',
          type: 'upload',
          use_filename: true,
          unique_filename: true,
          filename_override: nameWithExt,
        },
        (error, uploaded) => {
          if (error) return reject(error);
          resolve(uploaded);
        }
      );
      uploadStream.end(file.buffer);
    });

    // Ensure the delivery URL ends with the extension for better browser handling
    const viewUrl = cloudinary.url(result.public_id, {
      resource_type: 'raw',
      type: 'upload',
    });

    return res.json({
      url: viewUrl,
      public_id: result.public_id,
      resource_type: result.resource_type,
    });
  } catch (err) {
    console.error('Upload resume error:', err);
    return res.status(500).json({ message: 'Failed to upload resume' });
  }
}

module.exports.uploadResume = uploadResume;

