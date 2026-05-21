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

message:`Review for ISBN ${isbn} added or updated`
});

}

);




// Delete review

router.delete("/auth/review/:isbn",(req,res)=>{

    let isbn=req.params.isbn;

    if(books[isbn]){

        books[isbn].reviews={};

        return res.status(200).json({
            message:`Review for ISBN ${isbn} deleted`
        });

    }

    return res.status(404).json({
        message:"Book not found"
    });

});

module.exports=router;
