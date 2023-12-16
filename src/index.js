// require('dotenv').config({path:'./env'}) first Approch to add dotenv
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

//Second approch to add dotenv
dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 7000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

