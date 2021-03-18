const express = require("express");
const app = express();
const User = require("./model/schema");
const path = require("path");
const cookieparser=require("cookie-parser");
const hbs = require("hbs");
const auth=require("./auth/auth");
const bcrypt=require("bcrypt");
const { cursorTo } = require("readline");
require('dotenv').config()
require("./conn/index");
app.use(cookieparser());
app.set('view engine', 'hbs');
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

hbs.registerPartials(partial_path);
//app.set('views',template_path);
app.use(express.urlencoded({ extended: false }));
app.get("", (req, res) => {
    res.render("index");
});
app.get("/secret",auth,(req,res)=>{
    res.render("secret");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {

});
app.post("/register", async (req, res) => {
    try {
        const user=new User(
            {
                name:req.body.firstname,
                email:req.body.email,
                password:req.body.password,
            }
        )
        const token=await user.generatetoken();

        res.cookie("jwt",token,{
            expires:new Date(Date.now()+6000000),
            httpOnly:true
        });
        const registered=await user.save();
        res.send(registered);
    }
    catch (err) {
        res.send("i am error");
    }

});
app.post("/login", async(req, res) => {
    const email=req.body.email;
    const password=req.body.password;
    const user=await User.findOne({email});
    if(user)
    {
        const match=bcrypt.compare(password,user.password);
        const token=await user.generatetoken();
        if(match)
        {
            res.cookie("jwt",token,{
                expires:new Date(Date.now()+6000000),
                httpOnly:true
            });
            res.send("fsdv");
        }
        else
        {
            res.send("invalid login");
        }
    }
    res.send("invalid details");
});
app.get("/logout",auth,async(req,res)=>{
    try{
        
        req.user.tokens=req.user.tokens.filter((cur)=>{
            return cur.token!=req.token;
        });
        res.clearCookie("jwt");
        await req.user.save();
        res.render("index");
    }catch(err){
        res.send(err);
    }
});
app.post("*", (req, res) => {
    res.send("hiii");
});
app.get("*", (req, res) => {
    res.send("hii");
});
app.listen(8080);
