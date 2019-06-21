const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
let dbUser = null;

router.get('/', (req, res) => {
    Blog
        .find()
        .then(blogs => {
            res.status(200).json(blogs);
        }).catch(err => res.status(500).send('something is wrong'));
});

router.get('/featured', (req, res) => {
    Blog
        .where('featured', true)
        .then(blogs => {
            res.status(200).json(blogs);
        }).catch(err => res.status(500).send('something is wrong'))
});

router.get('/:id', (req, res) => {
    Blog
        .findById(req.params.id)
        .then(blogs => {
            if (!blogs) res.status(404).send();
            res.status(200).json(blogs);
        }).catch(err => res.status(404))
});

router.post('/', (req, res) => {
    User
        .findById(req.body.authorId)
        .then(user => {
            dbUser = user;
            const blog = new Blog(req.body);
            blog.author = user._id;
            return blog.save();
        })
        .then(blog => {
            dbUser.blogs.push(blog);
            dbUser.save().then(() => res.status(201).json(blog));
        });
});


router.put('/:id', (req, res) => {
    Blog
        .findByIdAndUpdate(req.params.id, req.body)
        .then(item => {
            res.status(204).json(item)
        })
});

router.delete('/:id', (req, res) => {
    Blog
        .findByIdAndRemove(req.params.id)
        .then(blogs => {
            res.status(200).json(blogs);
        }).catch(err => res.status(404).send('not working'));
});

module.exports = router;