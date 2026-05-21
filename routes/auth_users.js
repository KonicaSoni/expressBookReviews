const express=require("express");

const router=express.Router();

const books=require("../booksdb");

const verifyToken=require("../middleware/auth");



// Add or modify review

router.put(

"/auth/review/:isbn",
verifyToken,

(req,res)=>{

let isbn=req.params.isbn;

let review=req.body.review;

let username=req.user.username;

books[isbn].reviews[username]=review;

res.json({

message:"Review added/updated"

});

}

);




// Delete review

router.delete(

"/auth/review/:isbn",
verifyToken,

(req,res)=>{

let isbn=req.params.isbn;

let username=req.user.username;

delete books[isbn].reviews[username];

res.json({

message:"Review deleted"

});

}

);

module.exports=router;