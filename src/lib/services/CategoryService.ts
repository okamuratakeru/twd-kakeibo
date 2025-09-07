import { supabase } from '../supabaseClient';

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  sortOrder: number;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export class CategoryService {
  public async getCategoryByName(userId: string, name: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('name', name)
      .eq('hidden', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('CategoryService getCategoryByName error:', error);
      throw new Error(`Failed to find category: ${error.message}`);
    }

    return this.mapToCategory(data);
  }

  public async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('CategoryService getCategoryById error:', error);
      throw new Error(`Failed to find category: ${error.message}`);
    }

    return this.mapToCategory(data);
  }

  public async getUserCategories(userId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('hidden', false)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('CategoryService getUserCategories error:', error);
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data.map(item => this.mapToCategory(item));
  }

  public async getOrCreateCategory(userId: string, name: string): Promise<Category> {
    // まず既存のカテゴリを探す
    let category = await this.getCategoryByName(userId, name);
    
    if (category) {
      return category;
    }

    // 存在しない場合は新規作成
    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name: name,
        color: this.getDefaultColorForCategory(name),
        sort_order: await this.getNextSortOrder(userId),
        hidden: false,
      })
      .select()
      .single();

    if (error) {
      console.error('CategoryService createCategory error:', error);
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return this.mapToCategory(data);
  }

  private async getNextSortOrder(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('categories')
      .select('sort_order')
      .eq('user_id', userId)
      .order('sort_order', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return 1;
    }

    return data[0].sort_order + 1;
  }

  private getDefaultColorForCategory(name: string): string {
    const colorMap: { [key: string]: string } = {
      '食費': '#FF6B6B',
      '交通費': '#4ECDC4',
      '住居費': '#45B7D1',
      '娯楽': '#F9CA24',
      '日用品': '#6C5CE7',
      '医療費': '#A0E7E5',
      'その他': '#95A5A6'
    };

    return colorMap[name] || '#95A5A6';
  }

  private mapToCategory(data: any): Category {
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      color: data.color,
      sortOrder: data.sort_order,
      hidden: data.hidden,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}