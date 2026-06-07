// import { v2 as cloudinary } from 'cloudinary'
// import fs from "fs"

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // For server-side uploads (thumbnails, small images only)
// const uploadOnCloudinary = async (filePath) => {
//   try {
//     if (!filePath) return null;
//     const uploadResult = await cloudinary.uploader.upload(filePath, { 
//       resource_type: 'auto' 
//     });
//     fs.unlinkSync(filePath);
//     return uploadResult.secure_url;
//   } catch (error) {
//     if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
//     console.error("Cloudinary upload error", error);
//     throw error;
//   }
// };

// // For direct browser → Cloudinary uploads (videos, large files)
// export const generateUploadSignature = (extraParams = {}) => {
//   const timestamp = Math.round(Date.now() / 1000);

//   // ✅ Only include params that you ALSO send in FormData
//   // resource_type is NOT signable — it goes in the URL
//   const paramsToSign = {
//     timestamp,
//     ...extraParams, // e.g. folder: "videos" if you want to organise in cloudinary
//   };

//   const signature = cloudinary.utils.api_sign_request(
//     paramsToSign,
//     process.env.CLOUDINARY_API_SECRET
//   );

//   return {
//     timestamp,
//     signature,
//     cloudName: process.env.CLOUDINARY_NAME,
//     apiKey: process.env.CLOUDINARY_API_KEY,
//   };
// };

// export default uploadOnCloudinary;
// export { cloudinary };




import dotenv from 'dotenv'
dotenv.config(); 
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto'
    });
    fs.unlinkSync(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Cloudinary upload error", error);
    throw error;
  }
};

export const generateUploadSignature = () => {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET
  );
  return { timestamp, signature };
};

export default uploadOnCloudinary;
export { cloudinary };