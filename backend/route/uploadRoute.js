import express from "express";
import { getUploadSignature } from "../controller/uploadController.js";

const uploadRouter = express.Router();
uploadRouter.get("/upload-signature", getUploadSignature);

export default uploadRouter;
