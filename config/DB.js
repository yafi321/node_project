import mongoose from "mongoose";

export const connectToDB = async ()=>{
    try{
    let con = await mongoose.connect(process.env.DB_URI)
    console.log("mongo db connect")
}
catch (err){
    console.log("cannot connect to mongo db"+ err.message)
    process.exit(1)
}
}