const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const blogUsersSchema = new mongoose.Schema({
  roll: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  associatedWith: { type: String, required: true },
  status: { type: String, default: 'pending' },
  user_type: { type: String, default:'normal', },
  image: { type: String },
  valid_till: { type: Date, default: Date.now},
  timestamp: { type: Date, default: Date.now },
  password: { type: String, required: true }
});

blogUsersSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  });

  blogUsersSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

const BlogUsers = mongoose.model('BlogUsers', blogUsersSchema);

module.exports = BlogUsers;
