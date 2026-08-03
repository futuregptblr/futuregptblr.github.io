# Cloudinary Resume Upload Setup

## Overview
The application now supports both URL-based resume submission and direct file upload using Cloudinary. Users can choose between uploading a PDF file directly or providing a URL link to their resume.

## Setup Instructions

### 1. Install Required Dependencies
Run the following command in the client directory:
```bash
cd client
npm install cloudinary-react
# or if using yarn:
yarn add cloudinary-react
```

### 2. Environment Variables
Add the following environment variables to your server's `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Cloudinary Account Setup
1. Sign up for a free Cloudinary account at https://cloudinary.com
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add these credentials to your environment variables

## Features Added

### Server-Side Changes
- **New API Endpoint**: `/api/cloudinary/sign-resume` - Signs resume upload requests
- **Enhanced Controller**: Added `signResumeUpload` function in `cloudinaryController.js`
- **Updated Routes**: Added resume upload route in `cloudinary.js`

### Client-Side Changes
- **Enhanced EditProfileModal**: Added file upload option alongside URL input
- **New API Function**: `apiCloudinarySignResume` for handling resume uploads
- **File Validation**: PDF files only, max 10MB size
- **Upload Progress**: Visual feedback during file upload
- **Error Handling**: Comprehensive error messages for upload failures

## How It Works

1. **User Selection**: Users can toggle between "URL Link" and "Upload File" options
2. **File Upload Process**:
   - User selects a PDF file
   - Client validates file type and size
   - Server generates signed upload parameters
   - File is uploaded directly to Cloudinary
   - Secure URL is returned and stored in user profile
3. **URL Input**: Users can still provide direct URLs to their resumes

## File Storage
- Resumes are stored in the `futuregpt/resumes` folder on Cloudinary
- Files are uploaded as raw resources (PDF format)
- Each upload gets a unique public_id to prevent conflicts

## Security
- Upload requests are signed using server-side API secret
- Only authenticated users can upload files
- File type and size validation prevents malicious uploads
- Unique public_ids prevent file overwrites

## Testing
To test the functionality:
1. Ensure environment variables are set
2. Start both client and server
3. Log in to the application
4. Go to Edit Profile
5. Try both URL input and file upload options

## Troubleshooting

### Invalid Signature Error
If you encounter an "Invalid Signature" error:

1. **Check Environment Variables**: Ensure all Cloudinary credentials are correctly set in your `.env` file
2. **Verify API Secret**: Make sure the API secret is correct and hasn't been regenerated
3. **Check Timestamp**: The error might be due to timestamp mismatch - the implementation now uses client-side timestamps to prevent this
4. **Server Logs**: Check server console for any error messages during signature generation

### Common Issues
- **File Size**: Ensure files are under 10MB
- **File Type**: Only PDF files are accepted
- **Authentication**: Make sure user is logged in before attempting upload
- **Network**: Check if Cloudinary API is accessible from your server

### Debug Mode
The server includes error logging for signature generation issues. Check the console output for detailed error information.
