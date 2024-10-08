const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Blog = require('./models/Blog');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const url = require('url');

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
const Comment = require('./models/Comment');

// Auth middleware

function authenticateUser(req, res, next) {
  let token = req.header("Authorization");
  // console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token is missing." });
  }
  token = token.split(" ")[1];
  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    // console.log(verified);

    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

app.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    const filePath = path.join('uploads', req.file.filename);
    const fullUrl = url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: filePath
    });
    res.status(200).json({ url: fullUrl });
  } catch (error) {
    res.status(400).send({ error: 'Failed to upload image' });
  }
});

app.use('/uploads', express.static('uploads'));


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
    }, secretKey, { expiresIn: '30d' });
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



app.get('/users', authenticateUser,  async (req, res) => {
  if (req.user.email !== 'litsoc@iitgn.ac.in') {
    return res.status(403).send({ message: 'Unauthorized' });
  }
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
    //exclude password from the response
    user.password = undefined;
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  console.log(updates);

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

app.delete('/users/:id', authenticateUser, async (req, res) => {
  if (req.user.email !== 'litsoc@iitgn.ac.in') {
    return res.status(403).send({ message: 'Unauthorized' });
  }
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
  console.log(updates);
  if (updates.includes('club_secy_approval') && req.user.email !== 'litsoc@iitgn.ac.in') {
    return res.status(403).send({ message: 'Unauthorized' });
  }
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
    console.log('Fetching blogs...');

    const blogs = await Blog.find({ status: 'published', club_secy_approval: 'true' }).populate('added_by', 'name email');

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
    const blog = await Blog.findById(_id).populate('added_by', 'name email');;
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
      return res.status(404).send({ message: "User not found" });
    }

    const blogs = await Blog.find({ added_by: req.params.id, status: 'published', club_secy_approval: 'true' });

    res.send(blogs);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
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
        $addFields: {
          blogs: {
            $filter: {
              input: '$blogs',
              as: 'blog',
              cond: { $eq: ['$$blog.status', 'published'] }
            }
          }
        }
      },
      {
        $match: { 'blogs.0': { $exists: true } } 
      },
      {
        $project: {
          password: 0 
        }
      }
    ]);

    res.send(authors);
  } catch (error) {
    res.status(500).send(error);
  }
});


//Writers Sections

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

// Club Secy Section

app.get('/approval/blogs', authenticateUser, async (req, res) => {
  try {
    const blogs = await Blog.find({ club_secy_approval: false });
    res.send(blogs);
  } catch (error) {
    res.status(500).send
  }
});

app.patch('/blogs/approval/:id', authenticateUser, async (req, res) => {
  const updates = Object.keys(req.body);
  if (updates.includes('club_secy_approval') && req.user.email !== 'lisoc@iitgn.ac.in') {
    return res.status(403).send({ message: 'Unauthorized' });
  }
  try {
    const blog = await Blog.findOne({ _id: req.params.id });

    if (!blog) {
      return res.status(404).send();
    }



    res.send(blog);
  } catch (error) {
    res.status(400).send(error);
  }
});


// Get all comments for a blog post
app.get('/blogs/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.id }).populate('added_by', 'name').exec();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/blogs/:id/comments', authenticateUser, async (req, res) => {
  const { content } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    // console.log(req.user._id);
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newComment = new Comment({
      content,
      added_by: req.user._id,
      blog: req.params.id
    });

    const savedComment = await newComment.save();
    res.status(201).json(await savedComment.populate('added_by', 'name'));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});