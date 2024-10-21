const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const app = express();

// Connect to MongoDB
const dbURI = 'mongodb+srv://monoSA:1234aaaa@node.mb98x.mongodb.net/node?retryWrites=true&w=majority&appName=node';
mongoose.connect(dbURI)
    .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
    .catch((err) => console.log('Database connection error:', err));

// Register view engine
app.set('view engine', 'ejs');

// Middleware & Static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'Home', blogs: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred while fetching blogs.');
        });
});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then(() => {
            res.redirect('/blogs'); // Redirect to blogs page after saving
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred while creating the blog.');
        });
});

// Route to render the create blog form
app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create Blog' });
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
     .then(result => {
         res.render('detailes', { blog: result, title: 'Blog Details' }); 
     })
     .catch(err => {
         console.log(err);
     });   
});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result => { 
       
        res.json({ redirect: '/blogs' });
    })
    .catch(err => {
        console.log(err);
    });
});



// 404 Page
app.use((req, res) => {
    res.status(404).render('404', { title: '404 Page' });
});