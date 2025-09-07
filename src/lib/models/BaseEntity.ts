export abstract class BaseEntity {
  public id: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(id?: string) {
    this.id = id || this.generateId();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  private generateId(): string {
    // UUID v4 形式の文字列を生成
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public touch(): void {
    this.updatedAt = new Date();
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  // 抽象メソッド：各エンティティで実装必須
  public abstract validate(): string[];
}