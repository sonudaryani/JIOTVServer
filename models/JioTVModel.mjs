import mongoose from "mongoose";

const jiotvSchema = new mongoose.Schema({
    key : String,
    value: String,
},
{
    collection: "Live",
})

const Jiotv = mongoose.model("Live", jiotvSchema)

export default Jiotv;