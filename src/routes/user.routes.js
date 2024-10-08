const {Router} = require("express")
// const { login } = require("../controller/user.controller")
const { signup, login, sendOtp} = require("../controller/user.controller")

const userRouter = Router()

// userRouter.post("/login",login)
userRouter.post("/signup", signup); // Updated to call signup function
userRouter.post("/login", login);
userRouter.post("/send-otp",sendOtp); // Updated to call login function
// userRouter.get("/get", getUserData); // Updated to call getuser function

module.exports = userRouter