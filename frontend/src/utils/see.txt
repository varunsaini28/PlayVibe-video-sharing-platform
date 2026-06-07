import axios from "axios";
import { serverUrl } from "./constants";
import { compressImage } from "./compressImage";

const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB per chunk

// ── Get signature from your backend ─────────────────────────────────────────
const getSignature = async (file, resourceType) => {
  const { data } = await axios.get(`${serverUrl}/api/upload/upload-signature`, {
    params: {
      fileType: file.type,
      fileSize: file.size,
      resourceType,
    },
    withCredentials: true,
  });
  return data;
};

// ── Upload image directly (no chunking needed for images) ────────────────────
const uploadImage = async (file, sigData, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sigData.apiKey);
  formData.append("timestamp", String(sigData.timestamp));
  formData.append("signature", sigData.signature);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
    formData,
    {
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress?.(percent);
      },
    }
  );

  return {
    url: response.data.secure_url,
    publicId: response.data.public_id,
  };
};

// ── Upload video in chunks ────────────────────────────────────────────────────
// const uploadVideoInChunks = async (file, sigData, uploadId, onProgress) => {
//   const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
//   let uploadedBytes = 0;
//   let finalUrl = null;
//   let finalPublicId = null;

//   for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
//     const start = chunkIndex * CHUNK_SIZE;
//     const end = Math.min(start + CHUNK_SIZE, file.size);
//     const chunk = file.slice(start, end);

//     const formData = new FormData();
//     formData.append("file", chunk);
//     formData.append("api_key", sigData.apiKey);
//     formData.append("timestamp", String(sigData.timestamp));
//     formData.append("signature", sigData.signature);

//     const response = await axios.post(
//       `https://api.cloudinary.com/v1_1/${sigData.cloudName}/video/upload`,
//       formData,
//       {
//         headers: {
//           "X-Unique-Upload-Id": uploadId,
//           "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
//         },
//         onUploadProgress: (e) => {
//           const chunkUploaded = uploadedBytes + e.loaded;
//           const percent = Math.round((chunkUploaded * 100) / file.size);
//           onProgress?.(percent);
//         },
//       }
//     );

//     uploadedBytes = end;

//     if (chunkIndex === totalChunks - 1) {
//       finalUrl = response.data.secure_url;
//       finalPublicId = response.data.public_id;
//     }
//   }

//   return { url: finalUrl, publicId: finalPublicId };
// };


// cloudinaryUpload.js — update uploadVideoInChunks
// const uploadVideoInChunks = async (file, sigData, uploadId, onProgress) => {
//   const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
//   let uploadedBytes = 0;
//   let finalUrl = null;
//   let finalPublicId = null;

//   for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
//     const start = chunkIndex * CHUNK_SIZE;
//     const end = Math.min(start + CHUNK_SIZE, file.size);
//     const chunk = file.slice(start, end);

//     // ✅ Get fresh signature for every chunk — prevents expiry on large files
//     const freshSig = await getSignature(file, "video");

//     const formData = new FormData();
//     formData.append("file", chunk);
//     formData.append("api_key", freshSig.apiKey);
//     formData.append("timestamp", String(freshSig.timestamp));
//     formData.append("signature", freshSig.signature);

//     const response = await axios.post(
//       `https://api.cloudinary.com/v1_1/${freshSig.cloudName}/video/upload`,
//       formData,
//       {
//         headers: {
//           "X-Unique-Upload-Id": uploadId,
//           "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
//         },
//         onUploadProgress: (e) => {
//           const chunkUploaded = uploadedBytes + e.loaded;
//           const percent = Math.round((chunkUploaded * 100) / file.size);
//           onProgress?.(percent);
//         },
//       }
//     );

//     uploadedBytes = end;

//     if (chunkIndex === totalChunks - 1) {
//       finalUrl = response.data.secure_url;
//       finalPublicId = response.data.public_id;
//     }
//   }

//   return { url: finalUrl, publicId: finalPublicId };
// };


// const uploadVideoInChunks = async (file, sigData, uploadId, onProgress) => {
//   const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
//   let uploadedBytes = 0;
//   let finalUrl = null;
//   let finalPublicId = null;

//   // ✅ Get ONE signature before the loop — reuse for all chunks
//   // (Cloudinary requires the same signature/timestamp across all chunks of one upload)
//   const sig = await getSignature(file, "video");

//   for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
//     const start = chunkIndex * CHUNK_SIZE;
//     const end = Math.min(start + CHUNK_SIZE, file.size);
//     const chunk = file.slice(start, end);

//     const formData = new FormData();
//     formData.append("file", chunk);
//     formData.append("api_key", sig.apiKey);
//     formData.append("timestamp", String(sig.timestamp));
//     formData.append("signature", sig.signature);

//     const response = await axios.post(
//       `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`,
//       formData,
//       {
//         headers: {
//           "X-Unique-Upload-Id": uploadId,
//           "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
//         },
//         onUploadProgress: (e) => {
//           const chunkUploaded = uploadedBytes + e.loaded;
//           const percent = Math.round((chunkUploaded * 100) / file.size);
//           onProgress?.(percent);
//         },
//       }
//     );

//     uploadedBytes = end;

//     if (chunkIndex === totalChunks - 1) {
//       finalUrl = response.data.secure_url;
//       finalPublicId = response.data.public_id;
//     }
//   }

//   return { url: finalUrl, publicId: finalPublicId };
// };

// sigData is now passed in — no internal getSignature call
const uploadVideoInChunks = async (file, sigData, uploadId, onProgress) => {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  let uploadedBytes = 0;
  let finalUrl = null;
  let finalPublicId = null;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("api_key", sigData.apiKey);
    formData.append("timestamp", String(sigData.timestamp));
    formData.append("signature", sigData.signature);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${sigData.cloudName}/video/upload`,
      formData,
      {
        headers: {
          "X-Unique-Upload-Id": uploadId,
          "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
        },
        onUploadProgress: (e) => {
          const chunkUploaded = uploadedBytes + e.loaded;
          const percent = Math.round((chunkUploaded * 100) / file.size);
          onProgress?.(percent);
        },
      }
    );

    uploadedBytes = end;

    if (chunkIndex === totalChunks - 1) {
      finalUrl = response.data.secure_url;
      finalPublicId = response.data.public_id;
    }
  }

  return { url: finalUrl, publicId: finalPublicId };
};









// ── Main export — used by CreateVideo and CreateShorts ───────────────────────
// export const uploadFileToCloudinary = async (file, resourceType, onProgress) => {
//   if (resourceType === "image") {
//     // Compress image before uploading
//     const compressed = await compressImage(file, 8); // max 8 MB
//     const sigData = await getSignature(compressed, "image");
//     return await uploadImage(compressed, sigData, onProgress);
//   }

//   if (resourceType === "video") {
//     const sigData = await getSignature(file, "video");
//     const uploadId = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
//     return await uploadVideoInChunks(file, sigData, uploadId, onProgress);
//   }

//   throw new Error(`Unsupported resourceType: ${resourceType}`);
// };


// cloudinaryUpload.js — fix uploadFileToCloudinary
// export const uploadFileToCloudinary = async (file, resourceType, onProgress) => {
//   if (resourceType === "image") {
//     const compressed = await compressImage(file, 8);
//     const sigData = await getSignature(compressed, "image"); // fresh signature
//     return await uploadImage(compressed, sigData, onProgress);
//   }

//   if (resourceType === "video") {
//     const sigData = await getSignature(file, "video"); // fresh signature, called right before upload
//     const uploadId = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
//     return await uploadVideoInChunks(file, sigData, uploadId, onProgress);
//   }

//   throw new Error(`Unsupported resourceType: ${resourceType}`);
// };


export const uploadFileToCloudinary = async (file, resourceType, onProgress) => {
  if (resourceType === "image") {
    const compressed = await compressImage(file, 8);
    const sigData = await getSignature(compressed, "image");
    return await uploadImage(compressed, sigData, onProgress);
  }

  if (resourceType === "video") {
    const sigData = await getSignature(file, "video"); // ✅ once here
    const uploadId = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return await uploadVideoInChunks(file, sigData, uploadId, onProgress); // ✅ pass it in
  }

  throw new Error(`Unsupported resourceType: ${resourceType}`);
};