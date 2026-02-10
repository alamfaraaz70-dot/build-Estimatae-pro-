
import { createClient } from '@supabase/supabase-js';
import { User, Project } from '../types';

const SUPABASE_URL = 'https://ukbgayoirtpqfhroowix.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zf8N5QVj85gpkBuRyXptyQ_I5TmR5Mo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const supabaseService = {
  // Projects (Orders)
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    
    // Map snake_case database fields to camelCase Project interface
    return (data || []).map(p => ({
      ...p,
      mobile_number: p.mobile_number, 
      createdAt: p.created_at,
      customerName: p.customer_name,
      customerId: p.customer_id,
      selectedLayoutUrl: p.selected_layout_url // Map from DB snake_case
    }));
  },

  async upsertProject(project: Project) {
    const dbProject = {
      id: project.id,
      customer_id: project.customerId,
      customer_name: project.customerName,
      first_name: project.firstName,
      last_name: project.lastName,
      email: project.email,
      mobile_number: project.mobile_number,
      details: project.details,
      status: project.status,
      estimates: project.estimates,
      messages: project.messages,
      created_at: project.createdAt,
      selected_layout_url: project.selectedLayoutUrl // Sync to DB snake_case
    };

    const { error } = await supabase
      .from('projects')
      .upsert(dbProject);
    
    if (error) console.error('Error saving project:', error);
  },

  // Users
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return (data || []).map(u => ({
      ...u,
      isApproved: u.is_approved,
      firstName: u.first_name,
      lastName: u.last_name,
      projectsDone: u.projects_done,
      companyName: u.company_name
    }));
  },

  async upsertUser(user: User) {
    const dbUser = {
      id: user.id,
      name: user.name,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
      is_approved: user.isApproved,
      experience: user.experience,
      projects_done: user.projectsDone,
      company_name: user.companyName,
      phone: user.phone,
      address: user.address,
      profile_image: user.profileImage
    };

    const { error } = await supabase
      .from('users')
      .upsert(dbUser);
    
    if (error) console.error('Error saving user:', error);
  }
};
