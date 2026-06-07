// import { generateUploadSignature } from "../config/cloudinary.js";

// const VIDEO_MAX_SIZE = 5 * 1024 * 1024 * 1024;
// const IMAGE_MAX_SIZE = 10 * 1024 * 1024;
// const VIDEO_TYPES = [
//   "video/mp4",
//   "video/quicktime",
//   "video/webm",
//   "video/ogg",
//   "video/x-msvideo",
//   "video/mpeg",
// ];
// const IMAGE_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
//   "image/gif",
// ];

// export const getUploadSignature = (req, res) => {
//   try {
//     const { fileType, fileSize, resourceType = "video" } = req.query;

//     if (!fileType || !fileSize) {
//       return res.status(400).json({ message: "fileType and fileSize are required" });
//     }

//     const size = Number(fileSize);
//     if (Number.isNaN(size)) {
//       return res.status(400).json({ message: "Invalid fileSize" });
//     }

//     const type = resourceType.toString().toLowerCase();

//     if (type === "video") {
//       if (!VIDEO_TYPES.includes(fileType)) {
//         return res.status(400).json({ message: "Unsupported video file type" });
//       }
//       if (size > VIDEO_MAX_SIZE) {
//         return res.status(400).json({ message: "Video file size exceeds 5 GB limit" });
//       }
//     } else if (type === "image") {
//       if (!IMAGE_TYPES.includes(fileType)) {
//         return res.status(400).json({ message: "Unsupported image file type" });
//       }
//       if (size > IMAGE_MAX_SIZE) {
//         return res.status(400).json({ message: "Image file size exceeds 20 MB limit" });
//       }
//     } else {
//       return res.status(400).json({ message: "resourceType must be either video or image" });
//     }

//     // ✅ no args needed anymore
//     const { timestamp, signature } = generateUploadSignature();

//     return res.status(200).json({
//       cloudName: process.env.CLOUDINARY_NAME,
//       apiKey: process.env.CLOUDINARY_API_KEY,
//       timestamp,
//       signature,
//       resourceType: type, // passed through for frontend to use in URL
//     });
//   } catch (error) {
//     console.error("Upload signature error:", error);
//     return res.status(500).json({ message: "Failed to generate upload signature" });
//   }
// };




import { generateUploadSignature } from "../config/cloudinary.js";

const VIDEO_MAX_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB
const IMAGE_MAX_SIZE = 10 * 1024 * 1024;        // 10 MB

const VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/ogg",
  "video/x-msvideo",
  "video/mpeg",
  "video/3gpp",
  "video/3gpp2",
  "video/x-matroska",
];

const IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const getUploadSignature = (req, res) => {
  console.log("SIGNATURE REQUEST:", req.query); // debug — remove in production
  try {
    const { fileType, fileSize, resourceType = "video" } = req.query;

    if (!fileSize) {
      return res.status(400).json({ message: "fileSize is required" });
    }

    const size = Number(fileSize);
    if (Number.isNaN(size)) {
      return res.status(400).json({ message: "Invalid fileSize" });
    }

    const type = resourceType.toString().toLowerCase();

    if (type === "video") {
      // allow empty fileType — some browsers/OS don't detect it
      const isValidType = !fileType || VIDEO_TYPES.includes(fileType);
      if (!isValidType) {
        return res.status(400).json({
          message: `Unsupported video type: ${fileType}`,
        });
      }
      if (size > VIDEO_MAX_SIZE) {
        return res.status(400).json({
          message: "Video file size exceeds 5 GB limit",
        });
      }
    } else if (type === "image") {
      const isValidType = !fileType || IMAGE_TYPES.includes(fileType);
      if (!isValidType) {
        return res.status(400).json({
          message: `Unsupported image type: ${fileType}`,
        });
      }
      if (size > IMAGE_MAX_SIZE) {
        return res.status(400).json({
          message: "Image file size exceeds 10 MB limit",
        });
      }
    } else {
      return res.status(400).json({
        message: "resourceType must be either video or image",
      });
    }

    const { timestamp, signature } = generateUploadSignature();

    return res.status(200).json({
      cloudName: process.env.CLOUDINARY_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      resourceType: type,
    });
  } catch (error) {
    console.error("Upload signature error:", error);
    return res.status(500).json({ message: "Failed to generate upload signature" });
  }
};