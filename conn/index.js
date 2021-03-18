const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/person",{ useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true}).then(()=>{
    console.log("sucess");
}).catch((err)=>{
    console.log(err);
});
