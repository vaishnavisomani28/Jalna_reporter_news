// Script to create a sample blog
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  featuredImage: String,
  published: Boolean,
  author: String,
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

async function createSampleBlog() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const sampleBlog = {
      title: 'Welcome to Jalna Reporter News',
      slug: 'welcome-to-jalna-reporter-news',
      content: `
        <h2>Welcome to Jalna Reporter News</h2>
        <p>We are excited to bring you the latest news, videos, and updates from Jalna and beyond.</p>
        <p>Our mission is to keep you informed with accurate, timely, and comprehensive news coverage.</p>
        <h3>What We Offer:</h3>
        <ul>
          <li>Latest YouTube videos and live streams</li>
          <li>In-depth articles and blog posts</li>
          <li>Local news coverage</li>
          <li>Breaking news updates</li>
        </ul>
        <p>Stay tuned for more updates!</p>
      `,
      excerpt: 'Welcome to Jalna Reporter News - Your trusted source for latest news, videos, and articles.',
      published: true,
      author: 'Admin',
    };

    const existing = await Blog.findOne({ slug: sampleBlog.slug });
    if (existing) {
      console.log('Sample blog already exists. Skipping...');
      await mongoose.connection.close();
      process.exit(0);
    }

    const blog = new Blog(sampleBlog);
    await blog.save();

    console.log('\n✅ Sample blog created successfully!');
    console.log('Title:', blog.title);
    console.log('Slug:', blog.slug);
    console.log('Published:', blog.published);
    console.log('\nYou can view it at: http://localhost:3000/blogs/' + blog.slug);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample blog:', error);
    process.exit(1);
  }
}

createSampleBlog();

