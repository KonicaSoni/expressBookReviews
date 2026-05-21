const express=require("express");
const session=require("express-session");
const bodyParser=require("body-parser");

const general=require("./routes/general");
const auth=require("./routes/auth_users");

const app=express();

app.use(bodyParser.json());

app.use(session({
    secret:"bookstore",
    resave:true,
    saveUninitialized:true
}));

app.use("/",general);
app.use("/customer",auth);

const PORT=5000;

app.listen(PORT,()=>{

    console.log(`Server running on port ${PORT}`);

});