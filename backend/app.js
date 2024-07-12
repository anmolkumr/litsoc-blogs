const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Blog = require('./models/Blog');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');


const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors()); //this will enable cross domain acess
app.use(cookieParser());

const secretKey = 'anmolqwe123';
dotenv.config();

// mongoose.connect(process.env.MONGO_URL_LOCAL)
//   .then(() => console.log('MongoDB is connected now!!'))
//   .catch(err => console.log(err));

mongoose.connect(process.env.MONGO_URL_PROD)
  .then(() => console.log('MongoDB is connected now!!'))
  .catch(err => console.log(err));

const User = require('./models/User');

// Auth middleware

function authenticateUser(req, res, next) {
  let token = req.header("Authorization");
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token is missing." });
  }
  token = token.split(" ")[1];
  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;

    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

// login handling
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    console.log(user);
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).send({ error: 'Wrong credentials' });
    }
    console.log("password matched")

    const token = jwt.sign({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    }, secretKey, { expiresIn: '4h' });
    res.cookie("token", token);
    res.status(200).send({ token });
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


app.post('/blogs', authenticateUser, async (req, res) => {
  const { title, content, featured_img } = req.body;
  const blog = new Blog({ title, content, featured_img, added_by: req.user._id });

  try {
    await blog.save();
    res.status(201).send(blog);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.patch('/blogs/:id', authenticateUser, async (req, res) => {
  const updates = Object.keys(req.body);

  try {
    const blog = await Blog.findOne({ _id: req.params.id });

    if (!blog) {
      return res.status(404).send();
    }

    updates.forEach((update) => blog[update] = req.body[update]);
    await blog.save();
    res.send(blog);
  } catch (error) {
    res.status(400).send(error);
  }
});


// Getting all blogs
app.get('/blogs', async (req, res) => {
  try {
    console.log('Fetching blogs with status published...');

    // Fetch blogs with status 'published' and populate the 'added_by' field
    const blogs = await Blog.find({ status: 'published' }).populate('added_by', 'name email');

    console.log('Fetched blogs:', blogs);

    // Check if blogs array is empty
    if (blogs.length === 0) {
      console.log('No published blogs found');
      return res.status(404).send({ message: 'No published blogs found' });
    }

    // Send the fetched blogs
    res.send(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
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
// Get post by user id
app.get('/blogs/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }

    await user.populate('blogs').execPopulate();
    res.send(user.blogs);
  } catch (error) {
    res.status(500).send(error);
  }
});
 

// Authors 
app.get('/authors', async (req, res) => {
  try {
    const authors = await User.aggregate([
      {
        $match: { user_type: 'normal' }
      },
      {
        $lookup: {
          from: 'blogs',
          localField: '_id',
          foreignField: 'added_by',
          as: 'blogs'
        }
      },
      {
        $match: { 'blogs.0': { $exists: true } }
      },
      {
        $project: {
          password: 0 // Exclude the password field if it exists in the User schema
        }
      }
    ]);

    res.send(authors);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.get('/admin/blogs', authenticateUser, async (req, res) => {
  try {
    params = req.user;
    console.log(params);
    const blogs = await Blog.find({ added_by: params._id });
    res.send(blogs);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get('admin/blogs/:id', authenticateUser, async (req, res) => {
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
    const blog = await Blog.findOneAndDelete({ _id: req.params.id });

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