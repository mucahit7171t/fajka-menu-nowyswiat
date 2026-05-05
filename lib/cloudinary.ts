import { v2 as cloudinary } from 'cloudinary';

const cleanEnvVar = (val?: string) => val?.replace(/^["']|["']$/g, '');

cloudinary.config({
  cloud_name: cleanEnvVar(process.env.CLOUDINARY_CLOUD_NAME),
  api_key: cleanEnvVar(process.env.CLOUDINARY_API_KEY),
  api_secret: cleanEnvVar(process.env.CLOUDINARY_API_SECRET),
  secure: true,
});

export default cloudinary;
