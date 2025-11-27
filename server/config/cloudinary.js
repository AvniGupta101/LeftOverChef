// server/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

/**
 * Upload a base64 image string to Cloudinary
 * @param {string} base64String - Base64 encoded image (with or without data URI prefix)
 * @param {string} folder - Cloudinary folder name (default: "leftoverchef")
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export async function uploadBase64Image(base64String, folder = "leftoverchef") {
  try {
    // Ensure base64 string has proper data URI format
    if (!base64String.startsWith('data:')) {
      base64String = `data:image/jpeg;base64,${base64String}`
    }

    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: 'auto'
    })

    return result.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

export default cloudinary