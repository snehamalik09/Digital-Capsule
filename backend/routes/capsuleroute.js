import express from "express";
import { createCapsule, getUserCapsules, updateCapsuleStatus, getUserPrivateCapsule, getUserPublicCapsule, deleteCapsule, updateCapsule, upload } from "../controllers/capsulecontroller.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isAuthenticatedUser, upload.array('media', 5), createCapsule);
router.get("/me", isAuthenticatedUser, getUserCapsules);
router.put("/status/update", isAuthenticatedUser, updateCapsuleStatus);
router.get("/me/private", isAuthenticatedUser, getUserPrivateCapsule);
router.get("/me/public", isAuthenticatedUser, getUserPublicCapsule);
router.delete("/delete/:id", isAuthenticatedUser, deleteCapsule);
router.put('/update/:id', isAuthenticatedUser, updateCapsule);

export { router };
