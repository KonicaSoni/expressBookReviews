const express=require("express");
const jwt=require("jsonwebtoken");

const router=express.Router();

const books=require("../booksdb");
const axios = require("axios");
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

    const user = users.find(
        u => u.username===username &&
        u.password===password
    );

    if(!user){

        return res.status(401).json({
            message:"Invalid credentials"
        });

    }

    const token = jwt.sign(
        {username},
        "access",
        {expiresIn:"1h"}
    );

    return res.status(200).json({
        message:"Login successful!",
        token: token
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
router.get("/review/:isbn",(req,res)=>{

    let isbn=req.params.isbn;

    if(!books[isbn]){

        return res.status(404).json({
            message:"Book not found"
        });

    }

    res.json(books[isbn].reviews);

});

// Get all books using async callback
router.get("/asyncbooks", async (req,res)=>{

try{

const response = await axios.get(
"http://localhost:5000/books"
);

return res.status(200).json(
response.data
);

}
catch(error){

return res.status(500).json({
message:"Error retrieving books"
});

}

});


// Search by ISBN using Promise
router.get("/promise/isbn/:isbn",(req,res)=>{

let isbn=req.params.isbn;

axios.get(
`http://localhost:5000/books/isbn/${isbn}`
)

.then(response=>{

res.status(200).json(
response.data
);

})

.catch(error=>{

res.status(404).json({
message:"Book not found"
});

});

});


// Search by Author using async/await
router.get("/async/author/:author", async(req,res)=>{

try{

let author=req.params.author;

const response=await axios.get(
`http://localhost:5000/books/author/${author}`
);

res.status(200).json(
response.data
);

}

catch(error){

res.status(404).json({
message:"Author not found"
});

}

});


// Search by Title using async/await
router.get("/async/title/:title", async(req,res)=>{

try{

let title=req.params.title;

const response=await axios.get(
`http://localhost:5000/books/title/${title}`
);

res.status(200).json(
response.data
);

}

catch(error){

res.status(404).json({
message:"Title not found"
});

}

});
module.exports=router;
