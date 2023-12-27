import { Router } from "express";
import { logoutUser,loginUser,registerUser,refreshAccessToken, changeCurrentPassword, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secured routes
// logout routes
router.route("/logout").post(verifyJWT, logoutUser)
//refresh token routes
router.route("/refresh-token").post(refreshAccessToken)
// change password
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
// current user
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
//update avatar
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
// update cover image
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
//channel profile
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
//WatchHistoy
router.route("/history").get(verifyJWT,getWatchHistory)






export default router;
