import { supabase } from './supabase';
import { logger } from './logger';

// Blog interface
export interface Blog {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  published: boolean;
  author: string;
  created_at?: string;
  updated_at?: string;
}

// User interface
export interface User {
  id?: string;
  username: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

// Video interface
export interface Video {
  id?: string;
  video_id: string;
  title: string;
  description: string;
  thumbnail: string;
  published_at: string;
  is_live: boolean;
  channel_id: string;
  created_at?: string;
  updated_at?: string;
}

// Blog operations
export const blogDb = {
  async getAll(published: boolean = true, page: number = 1, limit: number = 100) {
    try {
      let query = supabase.from('blogs').select('*', { count: 'exact' });
      
      if (published) {
        query = query.eq('published', true);
      }
      
      const skip = (page - 1) * limit;
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(skip, skip + limit - 1);
      
      if (error) {
        // Log error but don't throw - return empty array instead
        logger.error('Supabase error fetching blogs', error instanceof Error ? error : undefined);
        return { data: [], count: 0 };
      }
      return { data: data || [], count: count || 0 };
    } catch (error) {
      logger.error('Error in blogDb.getAll', error instanceof Error ? error : undefined);
      return { data: [], count: 0 };
    }
  },

  async getBySlug(slug: string, published: boolean = true) {
    let query = supabase.from('blogs').select('*').eq('slug', slug);
    
    if (published) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  async create(blog: Omit<Blog, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('blogs')
      .insert([blog])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(slug: string, updates: Partial<Blog>) {
    const { data, error } = await supabase
      .from('blogs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('slug', slug)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateById(id: string, updates: Partial<Blog>) {
    const { data, error } = await supabase
      .from('blogs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(slug: string) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('slug', slug);
    
    if (error) throw error;
    return true;
  },

  async checkSlugExists(slug: string) {
    const { data, error } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (error && error.code === 'PGRST116') return false; // Not found
    if (error) throw error;
    return !!data;
  },
};

// User operations
export const userDb = {
  async findByUsername(username: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        // Log the error for debugging
        console.error('Supabase error in findByUsername:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in userDb.findByUsername:', error);
      throw error;
    }
  },

  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// Video operations
export const videoDb = {
  async getAll() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByVideoId(videoId: string) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('video_id', videoId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  async upsert(video: Omit<Video, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('videos')
      .upsert([video], { onConflict: 'video_id' })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getLiveStream() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('is_live', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },
};

