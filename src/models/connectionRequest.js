const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    status:{
        type:String,
        enum:{
            values:["ignore","interested","accepted","required"],
            message: " status not supported"
        },
    },
},
{timestamps:true},
);

connectionRequestSchema.index({fromUserId:1,toUserId:1});


module.exports = mongoose.model("ConnectionRequest",connectionRequestSchema);    