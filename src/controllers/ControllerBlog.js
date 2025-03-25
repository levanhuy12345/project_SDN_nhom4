const BlogPost = require('../models/ModelBlog');

// Get all blogs with pagination and filters
exports.getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const search = req.query.search;
        const status = req.query.status;

        let query = {};

        if (category) {
            query.category = category;
        }

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
            ];
        }

        const blogs = await BlogPost.find(query)
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await BlogPost.countDocuments(query);

        res.json({
            blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get single blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await BlogPost.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Increment view count
exports.incrementViews = async (req, res) => {
    try {
        const blog = await BlogPost.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        blog.views += 1;
        await blog.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new blog
exports.createBlog = async (req, res) => {
    try {
        const blog = new BlogPost({
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt,
            author: req.user._id,
            category: req.body.category,
            image: req.file ? req.file.filename : null,
            tags: req.body.tags,
            status: req.body.status || 'published',
        });

        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update blog
exports.updateBlog = async (req, res) => {
    try {
        const blog = await BlogPost.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const updatedBlog = await BlogPost.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content,
                excerpt: req.body.excerpt,
                author: req.body.author,
                category: req.body.category,
                image: req.body.image,
                tags: req.body.tags,
                status: req.body.status,
            },
            { new: true, runValidators: true },
        );

        res.json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await BlogPost.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        await blog.remove();
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add comment to blog
exports.addComment = async (req, res) => {
    try {
        const blog = await BlogPost.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.comments.push({
            content: req.body.content,
            author: req.user._id,
        });

        await blog.save();
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Like blog
exports.likeBlog = async (req, res) => {
    try {
        const blog = await BlogPost.findById(req.params.id);
        const userEmail = req.user.email; // Get user email from JWT token

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user has already liked this blog
        if (blog.likedBy.includes(userEmail)) {
            return res.status(400).json({ message: 'You have already liked this blog' });
        }

        // Add user to likedBy array and increment likes count
        blog.likedBy.push(userEmail);
        blog.likes += 1;
        await blog.save();

        res.json({
            success: true,
            likes: blog.likes,
            message: 'Blog liked successfully',
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
