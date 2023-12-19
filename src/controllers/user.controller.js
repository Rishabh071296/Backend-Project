import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { response } from "express";

// access and referesh token

const generateAccessTokenAndRefereshTokens = async(userId) => {
    try {
      const user =   await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      user.refreshToken = refreshToken
      await user.save({validateBeforSave: false})
      return {accessToken,refreshToken} 

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generation referesh and access token")
    }
}


//  register user Algo..

const registerUser = asyncHandler (async (req,res) =>{
   // get user details from frontend
   // validation - not empty
   // check if user already exists : username,email
   // check for images, check for avatar
   // upload them to cloudinary , avator
   // create user object - create entry in db
   // remove password and refresh token field from response
   // check for user creation
   // return response


   //validation Part

   const {fullName, email, username,password} = req.body
   //console.log( "email:",email);

   if (
    [fullName,email,username,password].some ((field)=> field?.trim()==="")
   ) {
    throw new ApiError (400,"All fields are required")
   }

   //check if user already exists

   const existedUser = await User.findOne({
    $or: [{username},{email},{password}]
   })
   if (existedUser){
    throw new ApiError (409,"User with email,username or password already exists")
   }

   // check for images, check for avatar

   const avatarLocalPath = req.files?.avatar[0]?.path;
   //const coverImageLocalPath = req.files?.coverImage[0]?.path;
   let coverImageLocalPath;
   
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0) {
    coverImageLocalPath = req.files.coverImage[0].path
   }

   if (!avatarLocalPath) {
    throw new ApiError (400, "Avatar file is required")
   }

   // upload them to cloudinary , avator

   const avatar = await uploadOnCloudinary (avatarLocalPath)
   const coverImage = await uploadOnCloudinary (coverImageLocalPath)
   if (!avatar){
    throw new ApiError (400, "Avatar file is required")
   }

   // create user object - create entry in db

   const user = await User.create ({
    fullName,
    avatar: avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    username: username. toLowerCase()
   })

// remove password and refresh token field from response

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)
// check for user creation

if (!createdUser) {
    throw new ApiError (500, "Something went wrong while registering the user")
}

 // return response
 
 return res.status (201).json(
    new ApiResponse (200,createdUser,"User registered Successfully")
 )

})

// Sign in Algo.

const loginUser = asyncHandler (async (req, res) => {

// req body - data
// username or email
// find the user
// password check
// access and referesh token
// send cookie

// req body - data

const {email, username, password} = req.body

// username or email

if (!(username || email)){
    throw new ApiError (400,"Username or email is required")
}

// find the user

const user = await User.findOne({
    $or: [{username},{email}]
})

if (!user) {
    throw new ApiError(404, "User does not exist")
}

// password check

const isPasswordValid = await user.isPasswordCorrect (password)

if (!isPasswordCorrect) {
    throw new ApiError(401, "User does not exist")
}

// access and referesh token- create a method and acces the token (method in the top)

const {accessToken,refreshToken} = await generateAccessTokenAndRefereshTokens(user._id)

// send cookie

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
const options = {
    httpOnly: true,
    secure: true
}
return res
.status(200)
.cookie("accessToken", accessToken,options)
.cookie("refreshToken", refreshToken,options)
.json(
    new ApiResponse(
        200,
        {
            user: loggedInUser,accessToken,refreshToken
        },
        "User logged In Successfully"
    )
)
});

export {registerUser, loginUser}