import { BaseRepository } from './BaseRepository';
import { Expense, Currency } from '../models/Expense';
import { NotFoundError, ValidationError } from '../controllers/BaseController';
import { supabase } from '../supabaseClient';

export class ExpenseRepository extends BaseRepository<Expense> {
  constructor() {
    super('expenses');
  }

  public async create(expense: Expense): Promise<Expense> {
    // バリデーション
    const validationErrors = expense.validate();
    if (validationErrors.length > 0) {
      throw new ValidationError(validationErrors.join(', '));
    }

    // Supabaseに保存するデータ準備（新しいスキーマに対応）
    const insertData = {
      id: expense.id,
      user_id: expense.userId,
      receipt_id: expense.receiptId || null,
      date: expense.date.toISOString().split('T')[0], // YYYY-MM-DD format
      store: expense.store || null,
      memo: expense.memo || null,
      twd_amount: expense.twdAmount || null,
      jpy_amount: expense.jpyAmount,
      fx_rate_used: expense.fxRateUsed || null,
      category_id: expense.categoryId || null,
      created_at: expense.createdAt.toISOString(),
      updated_at: expense.updatedAt.toISOString(),
    };

    const { data, error } = await supabase
      .from('expenses')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase create error:', error);
      throw new ValidationError(`Failed to create expense: ${error.message} (Code: ${error.code})`);
    }

    return this.mapToExpense(data);
  }

  public async findById(id: string): Promise<Expense | null> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('Supabase findById error:', error);
      throw new Error(`Failed to find expense: ${error.message}`);
    }

    return this.mapToExpense(data);
  }

  public async findAll(filters?: {
    userId?: string;
    month?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<Expense[]> {
    let query = supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });

    // フィルタリング
    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.month) {
      // "YYYY-MM" 形式での月フィルタ
      const startOfMonth = `${filters.month}-01`;
      const endOfMonth = this.getEndOfMonth(filters.month);
      query = query.gte('date', startOfMonth).lte('date', endOfMonth);
    }

    if (filters?.startDate) {
      query = query.gte('date', filters.startDate.toISOString());
    }

    if (filters?.endDate) {
      query = query.lte('date', filters.endDate.toISOString());
    }

    // ページネーション
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase findAll error:', error);
      throw new Error(`Failed to fetch expenses: ${error.message}`);
    }

    return data.map(item => this.mapToExpense(item));
  }

  public async update(id: string, updateData: Partial<Expense>): Promise<Expense> {
    // 既存データを取得
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError(`Expense with ID ${id} not found`);
    }

    // 更新データの準備（新しいスキーマに対応）
    const updateFields: any = {
      updated_at: new Date().toISOString(),
    };

    if (updateData.twdAmount !== undefined) updateFields.twd_amount = updateData.twdAmount;
    if (updateData.jpyAmount !== undefined) updateFields.jpy_amount = updateData.jpyAmount;
    if (updateData.fxRateUsed !== undefined) updateFields.fx_rate_used = updateData.fxRateUsed;
    if (updateData.categoryId !== undefined) updateFields.category_id = updateData.categoryId;
    if (updateData.date !== undefined) updateFields.date = updateData.date.toISOString().split('T')[0];
    if (updateData.store !== undefined) updateFields.store = updateData.store;
    if (updateData.memo !== undefined) updateFields.memo = updateData.memo;

    const { data, error } = await supabase
      .from('expenses')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw new ValidationError(`Failed to update expense: ${error.message}`);
    }

    return this.mapToExpense(data);
  }

  public async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(`Failed to delete expense: ${error.message}`);
    }

    return true;
  }

  // 特定の機能
  public async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Expense[]> {
    return this.findAll({
      userId,
      startDate,
      endDate
    });
  }

  public async getTotalByCategory(
    userId: string,
    month?: string
  ): Promise<{ category: string; total: number; count: number }[]> {
    let query = supabase
      .from('expenses')
      .select('category_id, jpy_amount')
      .eq('user_id', userId);

    if (month) {
      const startOfMonth = `${month}-01`;
      const endOfMonth = this.getEndOfMonth(month);
      query = query.gte('date', startOfMonth).lte('date', endOfMonth);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase getTotalByCategory error:', error);
      throw new Error(`Failed to get category totals: ${error.message}`);
    }

    // カテゴリ別に集計（JPY金額で集計）
    const categoryMap = new Map<string, { total: number; count: number }>();

    data.forEach(item => {
      const category = item.category_id || 'その他';
      const existing = categoryMap.get(category) || { total: 0, count: 0 };
      existing.total += item.jpy_amount;
      existing.count += 1;
      categoryMap.set(category, existing);
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count
    }));
  }

  public async getUserTotalAmount(userId: string, month?: string): Promise<number> {
    let query = supabase
      .from('expenses')
      .select('jpy_amount')
      .eq('user_id', userId);

    if (month) {
      const startOfMonth = `${month}-01`;
      const endOfMonth = this.getEndOfMonth(month);
      query = query.gte('date', startOfMonth).lte('date', endOfMonth);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase getUserTotalAmount error:', error);
      throw new Error(`Failed to get total amount: ${error.message}`);
    }

    return data.reduce((total, item) => total + item.jpy_amount, 0);
  }

  // プライベートヘルパーメソッド
  private mapToExpense(data: any): Expense {
    return new Expense({
      id: data.id,
      userId: data.user_id,
      receiptId: data.receipt_id,
      date: new Date(data.date),
      store: data.store,
      memo: data.memo,
      twdAmount: data.twd_amount,
      jpyAmount: data.jpy_amount,
      fxRateUsed: data.fx_rate_used,
      categoryId: data.category_id,
    });
  }

  private getEndOfMonth(month: string): string {
    const [year, monthNum] = month.split('-').map(Number);
    const lastDay = new Date(year, monthNum, 0).getDate(); // 月の最終日
    return `${year}-${monthNum.toString().padStart(2, '0')}-${lastDay}`;
  }
}