const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    added_by: {
        type: Schema.Types.ObjectId,
        ref: 'BlogUsers',
        required: true
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);
