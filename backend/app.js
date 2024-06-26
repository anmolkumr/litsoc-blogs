const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Blog = require('./models/Blog');


const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors()); //this will enable cross domain acess

const secretKey = 'anmolqwe123';

mongoose.connect('mongodb://localhost:27017/litsocblog')
    .then(() => console.log('MongoDB is connected now!!'))
    .catch(err => console.log(err));

const User = require('./models/User');

// login handling
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: 'Wrong credentials' });
        }

        const token = jwt.sign({ _id: user._id.toString() }, secretKey, { expiresIn: '4h' });

        res.send({ user, token });
    } catch (error) {
        res.status(500).send(error);
    }
});

//new user creation
app.post('/users', async (req, res) => {
    console.log(req.body);
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});



app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    // const allowedUpdates = ['user', 'roll', 'email', 'name', 'associated_with', 'status', 'user_type', 'image', 'valid_till', 'timestamp'];
    // const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    // if (!isValidOperation) {
    //     return res.status(400).send({ error: 'Invalid updates!' });
    // }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }

        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.post('/blogs', async (req, res) => {
    const blog = new Blog(req.body);
  
    try {
      await blog.save();
      res.status(201).send(blog);
    } catch (error) {
      res.status(400).send(error);
    }
  });

//   app.post('/users', async (req, res) => {
//     console.log(req.body);
//     try {
//         const user = new User(req.body);
//         await user.save();
//         res.status(201).send(user);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

// Getting all blogs
app.get('/blogs', async (req, res) => {
    try {
      const blogs = await Blog.find({});
      res.send(blogs);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/blogs/:id', async (req, res) => {
    const _id = req.params.id;
     
    
    try {
      const blog = await Blog.findById(_id);
      if (!blog) {
        return res.status(404).send();
      }
      res.send(blog);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // blog del by id
app.delete('/blogs/:id', async (req, res) => {
    try {
      const blog = await Blog.findOneAndDelete({ _id: req.params.id, added_by: req.user._id });
  
      if (!blog) {
        return res.status(404).send();
      }
  
      res.send(blog);
    } catch (error) {
      res.status(500).send(error);
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});