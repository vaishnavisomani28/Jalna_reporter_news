// Script to check database data
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const VideoSchema = new mongoose.Schema({}, { strict: false });
const BlogSchema = new mongoose.Schema({}, { strict: false });

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n📊 Database Status:');
    console.log('==================');
    
    const Video = mongoose.model('Video', VideoSchema);
    const Blog = mongoose.model('Blog', BlogSchema);
    
    const videos = await Video.countDocuments();
    const blogs = await Blog.countDocuments();
    const published = await Blog.countDocuments({ published: true });
    const live = await Video.countDocuments({ isLive: true });
    
    console.log('Videos:', videos);
    console.log('Live Streams:', live);
    console.log('Total Blogs:', blogs);
    console.log('Published Blogs:', published);
    console.log('==================\n');
    
    if (videos === 0) {
      console.log('⚠️  No videos found. Run: npm run fetch-videos');
    }
    
    if (published === 0) {
      console.log('⚠️  No published blogs. Create blogs from admin panel.');
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkData();

