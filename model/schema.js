const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userschema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        password: {
            type: String,
        },
        email: {
            type: String,
            require: true
        },
        tokens:[
            {
                token:{
                    type:String,
                    required:true
                }
            }
        ]


    }
);

userschema.methods.generatetoken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, "mynameisharshsinghalfromsaharanpur");
        console.log(`token is ${token}`);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}


userschema.pre("save", async function (next) {
    console.log(this.password);
    if (this.isModified("password"))
        this.password = await bcrypt.hash(this.password, 10);
    console.log(this.password);
    next();

});
const user = new mongoose.model("User", userschema);

module.exports = user;