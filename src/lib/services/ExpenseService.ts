import { ExpenseRepository } from '../repositories/ExpenseRepository';
import { Expense, Currency } from '../models/Expense';
import { NotFoundError } from '../controllers/BaseController';
import { CategoryService } from './CategoryService';
import { UserService } from './UserService';

export interface CreateExpenseDTO {
  amount: number;
  currency: Currency;
  category: string;
  date: string; // ISO string format
  storeName?: string;
  memo?: string;
  userId: string;
}

export interface UpdateExpenseDTO {
  amount?: number;
  currency?: Currency;
  category?: string;
  date?: string; // ISO string format
  storeName?: string;
  memo?: string;
}

export interface ExpenseFilters {
  month?: string; // "YYYY-MM" format
  category?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface MonthlyReport {
  expenses: Expense[];
  categoryTotals: { category: string; total: number; count: number }[];
  totalAmount: number;
  count: number;
  averageAmount: number;
}

export class ExpenseService {
  private expenseRepository: ExpenseRepository;
  private categoryService: CategoryService;
  private userService: UserService;

  constructor() {
    this.expenseRepository = new ExpenseRepository();
    this.categoryService = new CategoryService();
    this.userService = new UserService();
  }

  public async createExpense(expenseData: CreateExpenseDTO): Promise<Expense> {
    // ビジネスロジック・バリデーション
    await this.validateCreateData(expenseData);

    // 開発中は固定ユーザー（550e8400-e29b-41d4-a716-446655440000）を使用
    // UserService の呼び出しをスキップ

    // カテゴリ名からカテゴリIDを取得または作成
    const category = await this.categoryService.getOrCreateCategory(
      expenseData.userId,
      expenseData.category
    );

    // 新しいスキーマに対応したExpenseオブジェクトを作成
    const expense = Expense.createFromInput({
      userId: expenseData.userId,
      amount: expenseData.amount,
      currency: expenseData.currency,
      date: new Date(expenseData.date),
      store: expenseData.storeName,
      memo: expenseData.memo,
      categoryId: category.id, // カテゴリIDを使用
    });

    const createdExpense = await this.expenseRepository.create(expense);

    // 副作用（通知、ログ等）
    await this.notifyExpenseCreated(createdExpense);

    return createdExpense;
  }

  public async getExpenseById(id: string, userId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findById(id);
    if (!expense) {
      throw new NotFoundError(`Expense with ID ${id} not found`);
    }

    // 権限チェック
    if (expense.userId !== userId) {
      throw new NotFoundError(`Expense with ID ${id} not found`); // セキュリティのため404を返す
    }

    return expense;
  }

  public async getUserExpenses(
    userId: string,
    filters?: ExpenseFilters
  ): Promise<Expense[]> {
    return this.expenseRepository.findAll({
      userId,
      ...filters,
    });
  }

  public async updateExpense(
    id: string,
    userId: string,
    updateData: UpdateExpenseDTO
  ): Promise<Expense> {
    // 権限チェック
    await this.getExpenseById(id, userId);

    // 日付文字列をDateオブジェクトに変換
    const updateFields: Partial<Expense> = { ...updateData };
    if (updateData.date) {
      updateFields.date = new Date(updateData.date);
    }

    const expense = await this.expenseRepository.update(id, updateFields);

    // 副作用
    await this.notifyExpenseUpdated(expense);

    return expense;
  }

  public async deleteExpense(id: string, userId: string): Promise<void> {
    // 権限チェック
    await this.getExpenseById(id, userId);

    await this.expenseRepository.delete(id);

    // 副作用
    await this.notifyExpenseDeleted(id, userId);
  }

  public async getMonthlyReport(userId: string, month: string): Promise<MonthlyReport> {
    const [expenses, categoryTotals] = await Promise.all([
      this.expenseRepository.findAll({ userId, month }),
      this.expenseRepository.getTotalByCategory(userId, month)
    ]);

    const totalAmount = expenses.reduce((sum, exp) => sum + exp.jpyAmount, 0);
    const count = expenses.length;
    const averageAmount = count > 0 ? totalAmount / count : 0;

    return {
      expenses,
      categoryTotals,
      totalAmount,
      count,
      averageAmount: Math.round(averageAmount * 100) / 100, // 小数点2位まで
    };
  }

  public async getCategoryStats(userId: string, month?: string) {
    const categoryTotals = await this.expenseRepository.getTotalByCategory(userId, month);
    const total = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);

    return categoryTotals.map(cat => ({
      ...cat,
      percentage: total > 0 ? Math.round((cat.total / total) * 100 * 100) / 100 : 0,
    })).sort((a, b) => b.total - a.total); // 金額の降順でソート
  }

  public async getExpensivePurchases(
    userId: string,
    threshold: number = 10000,
    month?: string
  ): Promise<Expense[]> {
    const expenses = await this.expenseRepository.findAll({ userId, month });
    return expenses.filter(expense => expense.isExpensive(threshold));
  }

  // プライベートメソッド
  private async validateCreateData(data: CreateExpenseDTO): Promise<void> {
    // 追加のビジネスルールバリデーション
    if (data.amount > 1000000) {
      throw new Error('Amount cannot exceed 1,000,000');
    }

    // 未来の日付チェック
    const expenseDate = new Date(data.date);
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    if (expenseDate > threeDaysFromNow) {
      throw new Error('Expense date cannot be more than 3 days in the future');
    }
  }

  private async notifyExpenseCreated(expense: Expense): Promise<void> {
    // 通知ロジック（メール、プッシュ通知など）
    // TODO: 実際の通知システムを実装
  }

  private async notifyExpenseUpdated(expense: Expense): Promise<void> {
    // TODO: 更新通知を実装
  }

  private async notifyExpenseDeleted(expenseId: string, userId: string): Promise<void> {
    // TODO: 削除通知を実装
  }
}