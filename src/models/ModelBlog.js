const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        excerpt: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                'Chăm sóc giày',
                'Xu hướng thời trang',
                'Câu chuyện thương hiệu',
                'Hướng dẫn phong cách',
                'Văn hóa sneaker',
                'Thể thao & Hiệu suất',
                'Mẹo mua sắm',
            ],
        },
        image: {
            type: String,
            required: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        comments: [
            {
                content: {
                    type: String,
                    required: true,
                },
                author: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        views: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        likedBy: [
            {
                type: String, // Store user email
                required: true,
            },
        ],
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'published',
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('BlogPost', BlogPostSchema);
