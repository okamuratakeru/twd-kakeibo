import { NextRequest } from "next/server";
import { BaseController } from "./BaseController";
import {
  ExpenseService,
  CreateExpenseDTO,
  UpdateExpenseDTO,
  ExpenseFilters,
} from "../services/ExpenseService";

export class ExpenseController extends BaseController {
  private expenseService: ExpenseService;

  constructor() {
    super();
    this.expenseService = new ExpenseService();
  }

  // public async getExpenses(request: NextRequest) {
  //   return this.withErrorHandling(async () => {
  //     const userId = this.getUserIdFromRequest(request);
  //     const { searchParams } = new URL(request.url);

  //     // クエリパラメータの取得
  //     const filters: ExpenseFilters = {
  //       month: searchParams.get('month') || undefined,
  //       category: searchParams.get('category') || undefined,
  //       limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
  //       offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
  //     };

  //     // 日付範囲フィルタ
  //     const startDate = searchParams.get('startDate');
  //     const endDate = searchParams.get('endDate');
  //     if (startDate) filters.startDate = new Date(startDate);
  //     if (endDate) filters.endDate = new Date(endDate);

  //     const expenses = await this.expenseService.getUserExpenses(userId, filters);

  //     return this.createSuccessResponse({
  //       expenses: expenses.map(expense => expense.toJSON()),
  //       count: expenses.length,
  //       filters,
  //     });
  //   });
  // }

  public async createExpense(request: NextRequest) {
    return this.withErrorHandling(async () => {
      const userId = this.getUserIdFromRequest(request);
      const body = await this.parseRequestBody<CreateExpenseDTO>(request);

      // リクエストデータに userId を追加
      const expenseData: CreateExpenseDTO = {
        ...body,
        userId,
      };

      const expense = await this.expenseService.createExpense(expenseData);

      return this.createSuccessResponse(expense.toJSON(), 201);
    });
  }

  // public async getExpenseById(id: string, request: NextRequest) {
  //   return this.withErrorHandling(async () => {
  //     const userId = this.getUserIdFromRequest(request);

  //     const expense = await this.expenseService.getExpenseById(id, userId);

  //     return this.createSuccessResponse(expense.toJSON());
  //   });
  // }

  // public async updateExpense(id: string, request: NextRequest) {
  //   return this.withErrorHandling(async () => {
  //     const userId = this.getUserIdFromRequest(request);
  //     const body = await this.parseRequestBody<UpdateExpenseDTO>(request);

  //     const expense = await this.expenseService.updateExpense(id, userId, body);

  //     return this.createSuccessResponse(expense.toJSON());
  //   });
  // }

  // public async deleteExpense(id: string, request: NextRequest) {
  //   return this.withErrorHandling(async () => {
  //     const userId = this.getUserIdFromRequest(request);

  //     await this.expenseService.deleteExpense(id, userId);

  //     return this.createSuccessResponse({
  //       message: 'Expense deleted successfully',
  //       deletedId: id,
  //     });
  //   });
  // }

  // public async getMonthlyReport(month: string, request: NextRequest) {
  //   return this.withErrorHandling(async () => {
  //     const userId = this.getUserIdFromRequest(request);

  //     // 月フォーマットの検証
  //     const monthRegex = /^\d{4}-\d{2}$/;
  //     if (!monthRegex.test(month)) {
  //       return this.createErrorResponse('Invalid month format. Use YYYY-MM format.', 400);
  //     }

  //     const report = await this.expenseService.getMonthlyReport(userId, month);

  //     // レスポンス用にExpenseオブジェクトをJSONに変換
  //     const responseData = {
  //       ...report,
  //       expenses: report.expenses.map(expense => expense.toJSON()),
  //     };

  //     return this.createSuccessResponse(responseData);
  //   });
  // }

  // public async getCategoryStats(request: NextRequest) {
  //   return this.withErrorHandling(async () => {
  //     const userId = this.getUserIdFromRequest(request);
  //     const { searchParams } = new URL(request.url);
  //     const month = searchParams.get('month') || undefined;

  //     const stats = await this.expenseService.getCategoryStats(userId, month);

  //     return this.createSuccessResponse(stats);
  //   });
  // }

  // public async getExpensivePurchases(request: NextRequest) {
  //   return this.withErrorHandling(async () => {
  //     const userId = this.getUserIdFromRequest(request);
  //     const { searchParams } = new URL(request.url);

  //     const threshold = searchParams.get('threshold')
  //       ? parseInt(searchParams.get('threshold')!)
  //       : 10000;
  //     const month = searchParams.get('month') || undefined;

  //     const expensivePurchases = await this.expenseService.getExpensivePurchases(
  //       userId,
  //       threshold,
  //       month
  //     );

  //     return this.createSuccessResponse({
  //       purchases: expensivePurchases.map(expense => expense.toJSON()),
  //       threshold,
  //       count: expensivePurchases.length,
  //     });
  //   });
  // }

  // // バルク操作用のメソッド
  // public async bulkDelete(request: NextRequest) {
  //   return this.withErrorHandling(async () => {
  //     const userId = this.getUserIdFromRequest(request);
  //     const { ids } = await this.parseRequestBody<{ ids: string[] }>(request);

  //     if (!Array.isArray(ids) || ids.length === 0) {
  //       return this.createErrorResponse('IDs array is required and cannot be empty', 400);
  //     }

  //     // 権限チェックと削除を並行実行
  //     const deletePromises = ids.map(id =>
  //       this.expenseService.deleteExpense(id, userId)
  //     );

  //     await Promise.all(deletePromises);

  //     return this.createSuccessResponse({
  //       message: `${ids.length} expenses deleted successfully`,
  //       deletedIds: ids,
  //     });
  //   });
  // }

  // // エクスポート用のメソッド
  // public async exportExpenses(request: NextRequest) {
  //   return this.withErrorHandling(async () => {
  //     const userId = this.getUserIdFromRequest(request);
  //     const { searchParams } = new URL(request.url);

  //     const filters: ExpenseFilters = {
  //       month: searchParams.get('month') || undefined,
  //       category: searchParams.get('category') || undefined,
  //       startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
  //       endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
  //     };

  //     const expenses = await this.expenseService.getUserExpenses(userId, filters);

  //     // CSV形式のデータを生成
  //     const csvData = this.generateCSV(expenses);

  //     return this.createSuccessResponse({
  //       data: csvData,
  //       count: expenses.length,
  //       format: 'csv',
  //     });
  //   });
  // }

  // // プライベートヘルパーメソッド
  // private generateCSV(expenses: any[]): string {
  //   if (expenses.length === 0) return '';

  //   const headers = ['ID', 'Amount', 'Currency', 'Category', 'Date', 'Store Name', 'Memo', 'Created At'];
  //   const rows = expenses.map(expense => [
  //     expense.id,
  //     expense.amount,
  //     expense.currency,
  //     expense.category,
  //     expense.date.split('T')[0], // 日付部分のみ
  //     expense.storeName || '',
  //     expense.memo || '',
  //     expense.createdAt.split('T')[0],
  //   ]);

  //   return [headers, ...rows]
  //     .map(row => row.map(field => `"${field}"`).join(','))
  //     .join('\n');
  // }
}
