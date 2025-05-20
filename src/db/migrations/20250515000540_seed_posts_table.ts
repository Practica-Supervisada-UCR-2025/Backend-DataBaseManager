import { Knex } from "knex";
import { v4 as uuidv4 } from 'uuid';

export async function up(knex: Knex): Promise<void> {
  const USER_ID = 'aad06c03-08b8-4030-b006-c988347d9610';
  
  // Image URLs to choose from
  const imageUrls = [
    'https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg',
    'https://images.pexels.com/photos/8392533/pexels-photo-8392533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/8540821/pexels-photo-8540821.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    'https://images.pexels.com/photos/163016/crash-test-collision-60-km-h-distraction-163016.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/954585/pexels-photo-954585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=600'
  ];
  
  // Sample content for posts
  const sampleContents = [
    'Just had an amazing day at the beach! 🏖️',
    'Working on a new project, so excited to share the results soon!',
    'This view is absolutely breathtaking! 😍',
    'Happy to announce I have started a new journey today.',
    'Throwback to last summer adventures! 🌞',
    'Anyone else loving the new coffee shop downtown?',
    'Just finished reading an incredible book, highly recommend!',
    'Nothing beats a homemade meal on a rainy day.',
    'Morning hike with the best sunrise view!',
    'Learning something new every day keeps life interesting.',
    'Weekend vibes with my favorite people. ❤️',
    'The city lights at night are magical.',
    'Sometimes you just need to take a break and enjoy the moment.',
    'Celebrating small victories today!',
    'Nature always has a way of healing the soul.',
  ];
  
  // Generate 30 posts
  const posts = [];
  
  // Create 21 posts with status = 1 (including special cases)
  for (let i = 0; i < 21; i++) {
    // Generate base post with status = 1
    const post: {
      id: string;
      user_id: string;
      content: string | null;
      created_at: Date;
      updated_at: any;
      file_url: string | null;
      file_size: number | null;
      media_type: number | null;
      is_active: boolean;
      is_edited: boolean;
      status: number;
    } = {
      id: uuidv4(),
      user_id: USER_ID,
      content: sampleContents[Math.floor(Math.random() * sampleContents.length)],
      created_at: new Date(
        Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000)
      ), // Random date within last 60 days
      updated_at: knex.fn.now(),
      file_url: imageUrls[Math.floor(Math.random() * imageUrls.length)],
      file_size: Math.floor(Math.random() * 2000000) + 500000, // Random size between 500KB and 2.5MB
      media_type: Math.floor(Math.random() * 3) + 1, // Random media type 1-3
      is_active: true,
      is_edited: Math.random() > 0.8, // 20% chance of being edited
      status: 1
    };
    
    // Handle special cases
    if (i < 2) {
      // First 2 posts with null media fields
      post.file_url = null;
      post.file_size = null;
      post.media_type = null;
    } else if (i >= 2 && i < 4) {
      // Next 2 posts with null content
      post.content = null;
    }
    
    posts.push(post);
  }
  
  // Create 9 posts with status != 1
  for (let i = 0; i < 9; i++) {
    posts.push({
      id: uuidv4(),
      user_id: USER_ID,
      content: sampleContents[Math.floor(Math.random() * sampleContents.length)],
      created_at: new Date(
        Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000)
      ), // Random date within last 60 days
      updated_at: knex.fn.now(),
      file_url: Math.random() > 0.3 ? imageUrls[Math.floor(Math.random() * imageUrls.length)] : null, // 70% chance of having an image
      file_size: Math.random() > 0.3 ? Math.floor(Math.random() * 2000000) + 500000 : null,
      media_type: Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : null,
      is_active: true,
      is_edited: Math.random() > 0.8, // 20% chance of being edited
      status: Math.floor(Math.random() * 3) + 2 // Random status between 2-4
    } as any);
  }
  
  // Insert all posts
  await knex('posts').insert(posts);
}

export async function down(knex: Knex): Promise<void> {
  // Remove all posts associated with the specified user_id
  await knex('posts')
    .where('user_id', 'aad06c03-08b8-4030-b006-c988347d9610')
    .delete();
}

