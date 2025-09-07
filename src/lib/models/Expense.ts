import { BaseEntity } from './BaseEntity';

export type Currency = 'JPY' | 'TWD';

export class Expense extends BaseEntity {
  public userId: string;
  public receiptId?: string;
  public date: Date;
  public store?: string;
  public memo?: string;
  public twdAmount?: number;
  public jpyAmount: number;
  public fxRateUsed?: number;
  public categoryId?: string;

  constructor(data: {
    id?: string;
    userId: string;
    receiptId?: string;
    date: Date;
    store?: string;
    memo?: string;
    twdAmount?: number;
    jpyAmount: number;
    fxRateUsed?: number;
    categoryId?: string;
  }) {
    super(data.id);
    this.userId = data.userId;
    this.receiptId = data.receiptId;
    this.date = data.date;
    this.store = data.store;
    this.memo = data.memo;
    this.twdAmount = data.twdAmount;
    this.jpyAmount = data.jpyAmount;
    this.fxRateUsed = data.fxRateUsed;
    this.categoryId = data.categoryId;
  }

  // ビジネスロジック
  public getInputCurrency(): Currency {
    return this.twdAmount ? 'TWD' : 'JPY';
  }

  public getInputAmount(): number {
    return this.twdAmount || this.jpyAmount;
  }

  public isExpensive(threshold: number = 10000): boolean {
    return this.jpyAmount > threshold;
  }

  public isSameMonth(date: Date): boolean {
    return this.date.getFullYear() === date.getFullYear() &&
           this.date.getMonth() === date.getMonth();
  }

  public getFormattedInputAmount(): string {
    if (this.twdAmount) {
      return `NT$${this.twdAmount.toLocaleString()}`;
    }
    return `¥${this.jpyAmount.toLocaleString()}`;
  }

  public getFormattedJpyAmount(): string {
    return `¥${this.jpyAmount.toLocaleString()}`;
  }

  public static createFromInput(data: {
    userId: string;
    amount: number;
    currency: Currency;
    date: Date;
    store?: string;
    memo?: string;
    categoryId?: string;
    exchangeRate?: number;
  }): Expense {
    const exchangeRate = data.exchangeRate || 4.5; // Default exchange rate
    
    let twdAmount: number | undefined;
    let jpyAmount: number;
    let fxRateUsed: number | undefined;

    if (data.currency === 'TWD') {
      twdAmount = data.amount;
      jpyAmount = Math.round(data.amount * exchangeRate);
      fxRateUsed = exchangeRate;
    } else {
      jpyAmount = data.amount;
    }

    return new Expense({
      userId: data.userId,
      date: data.date,
      store: data.store,
      memo: data.memo,
      twdAmount,
      jpyAmount,
      fxRateUsed,
      categoryId: data.categoryId,
    });
  }

  // BaseEntityの抽象メソッドを実装
  public validate(): string[] {
    const errors: string[] = [];

    if (this.jpyAmount <= 0) {
      errors.push('JPY amount must be greater than 0');
    }

    if (this.twdAmount && this.twdAmount <= 0) {
      errors.push('TWD amount must be greater than 0');
    }

    if (!this.userId || this.userId.trim().length === 0) {
      errors.push('User ID is required');
    }

    if (!this.date) {
      errors.push('Date is required');
    }

    if (this.twdAmount && !this.fxRateUsed) {
      errors.push('Exchange rate is required when TWD amount is set');
    }

    return errors;
  }

  // JSON変換をオーバーライド
  public override toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      userId: this.userId,
      receiptId: this.receiptId,
      date: this.date.toISOString().split('T')[0], // YYYY-MM-DD format
      store: this.store,
      memo: this.memo,
      twdAmount: this.twdAmount,
      jpyAmount: this.jpyAmount,
      fxRateUsed: this.fxRateUsed,
      categoryId: this.categoryId,
      // Legacy compatibility fields
      amount: this.getInputAmount(),
      currency: this.getInputCurrency(),
      storeName: this.store,
      category: this.categoryId || 'その他',
    };
  }

  // 静的ファクトリーメソッド
  public static fromJSON(data: any): Expense {
    return new Expense({
      id: data.id,
      userId: data.user_id || data.userId,
      receiptId: data.receipt_id || data.receiptId,
      date: new Date(data.date),
      store: data.store || data.storeName,
      memo: data.memo,
      twdAmount: data.twd_amount || data.twdAmount,
      jpyAmount: data.jpy_amount || data.jpyAmount,
      fxRateUsed: data.fx_rate_used || data.fxRateUsed,
      categoryId: data.category_id || data.categoryId,
    });
  }
}