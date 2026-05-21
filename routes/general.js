const express = require('express');
const router = express.Router();
const books = require('../booksdb.js');
const jwt = require('jsonwebtoken');
const axios = require('axios');

let users = [];

// Check if user exists
const isValid = (username) => {
    let userswithsamename = users.filter(
        (user) => user.username === username
    );

    return userswithsamename.length > 0;
};

// Get all books
router.get('/books', (req, res) => {
    return res.status(200).json(books);
});

// Get book by ISBN
router.get('/books/isbn/:isbn', (req, res) => {

    let isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found"
    });

});

// Get book by Author
router.get('/books/author/:author', (req, res) => {

    let author = req.params.author;

    let filteredBooks = Object.values(books).filter(
        book =>
            book.author.toLowerCase().includes(
                author.toLowerCase()
            )
    );

    return res.status(200).json(filteredBooks);

});

// Get book by Title
router.get('/books/title/:title', (req, res) => {

    let title = req.params.title;

    let filteredBooks = Object.values(books).filter(
        book =>
            book.title.toLowerCase().includes(
                title.toLowerCase()
            )
    );

    return res.status(200).json(filteredBooks);

});

// Get review
router.get('/review/:isbn', (req, res) => {

    let isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(
            books[isbn].reviews
        );
    }

    return res.status(404).json({
        message: "Book not found"
    });

});

// Register
router.post('/register', (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {

        return res.status(404).json({
            message: "Username and password required"
        });

    }

    if (isValid(username)) {

        return res.status(404).json({
            message: "User already exists"
        });

    }

    users.push({
        username,
        password
    });

    return res.status(200).json({
        message: "User registered successfully"
    });

});

// Login
router.post('/login', (req, res) => {

    const { username, password } = req.body;

    let user = users.find(
        user =>
            user.username === username &&
            user.password === password
    );

    if (!user) {

        return res.status(401).json({
            message: "Invalid credentials"
        });

    }

    let token = jwt.sign(
        { username },
        "access",
        { expiresIn: '1h' }
    );

    return res.status(200).json({
        message: "Login successful!",
        token: token
    });

});


// -------- TASK 11 --------

// Search by ISBN using Promise
router.get('/promise/isbn/:isbn', (req, res) => {

    let isbn = req.params.isbn;

    axios.get(
        `http://localhost:5000/books/isbn/${isbn}`
    )

        .then(response => {

            return res.status(200).json(
                response.data
            );

        })

        .catch(error => {

            return res.status(404).json({
                message: "Book not found"
            });

        });

});

// Search by Author Async/Await
router.get('/async/author/:author', async (req, res) => {

    try {

        let author = req.params.author;

        const response = await axios.get(
            `http://localhost:5000/books/author/${author}`
        );

        return res.status(200).json(
            response.data
        );

    }

    catch {

        return res.status(404).json({
            message: "Author not found"
        });

    }

});

// Search by Title Async/Await
router.get('/async/title/:title', async (req, res) => {

    try {

        let title = req.params.title;

        const response = await axios.get(
            `http://localhost:5000/books/title/${title}`
        );

        return res.status(200).json(
            response.data
        );

    }

    catch {

        return res.status(404).json({
            message: "Title not found"
        });

    }

});

module.exports = router;
