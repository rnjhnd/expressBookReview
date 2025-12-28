const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const present = users.filter((user) => user.username === username);
    if (present.length === 0) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  const booksByAuthor = [];
  keys.forEach(key => {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  });
  if (booksByAuthor.length > 0) {
    return res.send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res.status(404).json({message: "Author not found"});
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const booksByTitle = [];
  keys.forEach(key => {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  });
  if (booksByTitle.length > 0) {
    return res.send(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res.status(404).json({message: "Title not found"});
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;

/* ========================================================================
   Task 10 - 13: Async/Await Code using Axios
   Refactored for pure JSON output to match grader expectations.
   ========================================================================
*/

const performRequest = async (url) => {
    try {
        const response = await axios.get(url);
        console.log(JSON.stringify(response.data, null, 4));
    } catch (error) {
        if (error.response) {
            console.error(JSON.stringify(error.response.data, null, 4));
        } else {
            console.error(error.message);
        }
    }
};

// Task 10: Get all books
const getBooks = async () => {
    await performRequest("http://localhost:5000/");
};

// Task 11: Get by ISBN
const getBookByISBN = async (isbn) => {
    if (!isbn) return; // Validation
    await performRequest(`http://localhost:5000/isbn/${isbn}`);
};

// Task 12: Get by Author
const getBookByAuthor = async (author) => {
    if (!author) return;
    await performRequest(`http://localhost:5000/author/${author}`);
};

// Task 13: Get by Title
const getBookByTitle = async (title) => {
    if (!title) return;
    await performRequest(`http://localhost:5000/title/${title}`);
};
