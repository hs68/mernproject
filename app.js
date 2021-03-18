const express = require("express");
const app = express();
const User = require("./model/schema");
const path = require("path");
const hbs = require("hbs");
const bcrypt=require("bcrypt");
require("./conn/index");

app.set('view engine', 'hbs');
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

hbs.registerPartials(partial_path);
//app.set('views',template_path);
app.use(express.urlencoded({ extended: false }));
app.get("", (req, res) => {
    res.render("index");
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
            res.send("fsdv");
        }
        else
        {
            res.send("invalid login");
        }
    }
    res.send("invalid details");
});
app.post("*", (req, res) => {
    res.send("hiii");
});
app.get("*", (req, res) => {
    res.send("hii");
});
app.listen(8080);
