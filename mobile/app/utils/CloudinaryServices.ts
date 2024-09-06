import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';

const CLOUDINARY_CLOUD_NAME = 'dhoopmcrq';
const CLOUDINARY_UPLOAD_PRESET = 'myPreset';

const processImage = async (imageUri: string): Promise<string> => {
  try {
    // Resize the image
    const processedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        { resize: { width: 1000 } },
      ],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    return processedImage.uri;
  } catch (error) {
    console.error('Error in processImage:', error);
    throw error;
  }
};

export const uploadToCloudinary = async (imageUri: string): Promise<string> => {
  console.log('Uploading image with URI:', imageUri);
  if (typeof imageUri !== 'string') {
    console.error('Invalid imageUri:', imageUri);
    throw new Error('Invalid image URI');
  }

  try {
    // Process the image
    const processedImageUri = await processImage(imageUri);

    console.log('Processed image URI:', processedImageUri);

    // Create form data
    const formData = new FormData();
    formData.append('file', {
      uri: processedImageUri,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`,
    } as any);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Make the upload request
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Cloudinary response:', response.data);

    // Return the secure URL of the uploaded image
    return response.data.secure_url;
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (imageUris: string[]): Promise<string[]> => {
  console.log('Uploading multiple images:', imageUris);
  try {
    const uploadPromises = imageUris.map(uri => uploadToCloudinary(uri));
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error) {
    console.error('Error in uploadMultipleImages:', error);
    throw error;
  }
};