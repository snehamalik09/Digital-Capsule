import { Capsule } from "../db/capsule.models.js";
import catchAsyncErrors from "../middlewares/catchasyncerrors.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import cloudinary from "cloudinary";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage }); 

const createCapsule = catchAsyncErrors(async (req, res, next) => {
  const { title, description, content, visibility, releaseAt } = req.body;

  if (!title || !description || !content || !releaseAt) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

let media = [];
console.log(req.files);
if (req.files && req.files.length > 0) {
  media = await Promise.all(
    req.files.map(async (file) => {
      const result = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream({ folder: "capsule_images" }, (error, result) => {
          if (error) {
            reject(new ErrorHandler("Cloudinary upload failed", 500));
          }
          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }).end(file.buffer);
      });
      return result;
    })
  );
}

  const newCapsule = await Capsule.create({
    title,
    description,
    content,
    createdBy: req.user.id,
    media,
    visibility: visibility || "private",
    isOpened: false,
    releaseAt,
  });

  res.status(201).json({
    success: true,
    message: "Capsule created successfully",
    data: newCapsule,
  });
});

export { createCapsule, upload };