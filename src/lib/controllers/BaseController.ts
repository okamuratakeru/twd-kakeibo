import { NextRequest, NextResponse } from 'next/server';

// カスタムエラークラス
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export abstract class BaseController {
  protected createSuccessResponse(data: any, status: number = 200): NextResponse {
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    }, { status });
  }

  protected createErrorResponse(message: string, status: number = 400): NextResponse {
    return NextResponse.json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    }, { status });
  }

  protected async withErrorHandling(
    handler: () => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      return await handler();
    } catch (error) {
      console.error('Controller Error:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      if (error instanceof ValidationError) {
        return this.createErrorResponse(error.message, 400);
      }
      
      if (error instanceof NotFoundError) {
        return this.createErrorResponse(error.message, 404);
      }

      if (error instanceof UnauthorizedError) {
        return this.createErrorResponse(error.message, 403);
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown internal server error';
      return this.createErrorResponse(`Internal server error: ${errorMessage}`, 500);
    }
  }

  protected async parseRequestBody<T>(request: NextRequest): Promise<T> {
    try {
      return await request.json();
    } catch (error) {
      throw new ValidationError('Invalid JSON format');
    }
  }

  protected getUserIdFromRequest(request: NextRequest): string {
    // TODO: 実際の認証実装時に JWT トークンやセッションから取得
    // const token = request.headers.get('Authorization');
    // const decoded = jwt.verify(token);
    // return decoded.userId;
    
    // 現在はモック実装（テスト用UUID）
    return '550e8400-e29b-41d4-a716-446655440000';
  }
}