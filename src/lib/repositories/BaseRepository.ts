import { BaseEntity } from '../models/BaseEntity';

export abstract class BaseRepository<T extends BaseEntity> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  // 抽象メソッド：各リポジトリで実装必須
  public abstract async create(data: Partial<T>): Promise<T>;
  public abstract async findById(id: string): Promise<T | null>;
  public abstract async findAll(filters?: Record<string, any>): Promise<T[]>;
  public abstract async update(id: string, data: Partial<T>): Promise<T>;
  public abstract async delete(id: string): Promise<boolean>;

  // 共通ユーティリティメソッド
  protected buildWhereClause(filters: Record<string, any>): string {
    if (!filters || Object.keys(filters).length === 0) {
      return '';
    }

    const conditions = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, _]) => `${key} = ?`);

    return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  }

  protected getFilterValues(filters: Record<string, any>): any[] {
    return Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([_, value]) => value);
  }

  // ページネーション用のSQL構築
  protected buildPaginationClause(page?: number, limit?: number): string {
    if (!page || !limit) {
      return '';
    }
    
    const offset = (page - 1) * limit;
    return `LIMIT ${limit} OFFSET ${offset}`;
  }

  // ソート用のSQL構築
  protected buildOrderClause(sortBy?: string, sortOrder?: 'ASC' | 'DESC'): string {
    if (!sortBy) {
      return 'ORDER BY createdAt DESC'; // デフォルトは作成日時の降順
    }

    const order = sortOrder || 'ASC';
    return `ORDER BY ${sortBy} ${order}`;
  }
}