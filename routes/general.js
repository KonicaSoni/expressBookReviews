const express=require("express");
const jwt=require("jsonwebtoken");

const router=express.Router();

const books=require("../booksdb");

let users=[];


// Get all books
router.get("/books",(req,res)=>{
res.send(books);
});


// Register
router.post("/register",(req,res)=>{

const {username,password}=req.body;

if(!username || !password){

return res.status(400).json({
message:"Please enter all fields"
});

}

users.push({
username,
password
});

res.json({
message:"User registered successfully"
});

});



// Login
router.post("/login",(req,res)=>{

const {username,password}=req.body;

const user=users.find(
u=>u.username===username &&
u.password===password
);

if(user){

const token=jwt.sign(
{username},
"access",
{expiresIn:"1h"}
);

return res.json({
token
});

}

res.status(401).json({
message:"Invalid credentials"
});

});
// Search by ISBN
router.get("/books/isbn/:isbn",(req,res)=>{

let isbn=req.params.isbn;

if(books[isbn]){

res.json(books[isbn]);

}
else{

res.status(404).json({
message:"Book not found"
});

}

});


// Search by author
router.get("/books/author/:author",(req,res)=>{

let author=req.params.author;

let filteredBooks=Object.values(books).filter(

book=>book.author.toLowerCase().includes(author.toLowerCase())

);

res.json(filteredBooks);

});


// Search by title
router.get("/books/title/:title",(req,res)=>{

let title=req.params.title;

let filteredBooks=Object.values(books).filter(

book=>book.title.toLowerCase().includes(title.toLowerCase())

);

res.json(filteredBooks);

});


// Get reviews for a book
router.get("/books/review/:isbn",(req,res)=>{

    let isbn=req.params.isbn;

    if(!books[isbn]){

        return res.status(404).json({
            message:"Book not found"
        });

    }

    res.json(books[isbn].reviews);

});
module.exports=router;
