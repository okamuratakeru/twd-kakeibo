export interface CreateExpenseDTO {
  amount: number;
  currency: string;
  category: string;
  date: string;
  storeName?: string;
  memo?: string;
}

export interface UpdateExpenseDTO {
  amount?: number;
  currency?: string;
  category?: string;
  date?: string;
  storeName?: string;
  memo?: string;
}

export interface ExpenseResponse {
  id: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  storeName?: string;
  memo?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ExpenseApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ExpenseApiError";
  }
}

const API_BASE_URL = "/api/expenses";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ExpenseApiError(
      response.status,
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.data || data;
}

export const expenseApi = {
  async createExpense(expense: CreateExpenseDTO): Promise<ExpenseResponse> {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    });

    return handleResponse<ExpenseResponse>(response);
  },

  // async getExpenses(filters?: {
  //   month?: string;
  //   category?: string;
  //   startDate?: string;
  //   endDate?: string;
  //   limit?: number;
  //   offset?: number;
  // }): Promise<{ expenses: ExpenseResponse[]; count: number }> {
  //   const searchParams = new URLSearchParams();

  //   if (filters) {
  //     Object.entries(filters).forEach(([key, value]) => {
  //       if (value !== undefined) {
  //         searchParams.append(key, value.toString());
  //       }
  //     });
  //   }

  //   const url = searchParams.toString()
  //     ? `${API_BASE_URL}?${searchParams.toString()}`
  //     : API_BASE_URL;

  //   const response = await fetch(url);
  //   return handleResponse<{ expenses: ExpenseResponse[]; count: number }>(response);
  // },

  // async getExpenseById(id: string): Promise<ExpenseResponse> {
  //   const response = await fetch(`${API_BASE_URL}/${id}`);
  //   return handleResponse<ExpenseResponse>(response);
  // },

  // async updateExpense(id: string, expense: UpdateExpenseDTO): Promise<ExpenseResponse> {
  //   const response = await fetch(`${API_BASE_URL}/${id}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(expense),
  //   });

  //   return handleResponse<ExpenseResponse>(response);
  // },

  // async deleteExpense(id: string): Promise<{ message: string; deletedId: string }> {
  //   const response = await fetch(`${API_BASE_URL}/${id}`, {
  //     method: 'DELETE',
  //   });

  //   return handleResponse<{ message: string; deletedId: string }>(response);
  // },

  // async bulkDeleteExpenses(ids: string[]): Promise<{ message: string; deletedIds: string[] }> {
  //   const response = await fetch(API_BASE_URL, {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ ids }),
  //   });

  //   return handleResponse<{ message: string; deletedIds: string[] }>(response);
  // },

  // async getCategoryStats(month?: string): Promise<any> {
  //   const searchParams = new URLSearchParams();
  //   if (month) {
  //     searchParams.append('month', month);
  //   }

  //   const url = searchParams.toString()
  //     ? `${API_BASE_URL}/stats?${searchParams.toString()}`
  //     : `${API_BASE_URL}/stats`;

  //   const response = await fetch(url);
  //   return handleResponse(response);
  // },

  // async exportExpenses(filters?: {
  //   month?: string;
  //   category?: string;
  //   startDate?: string;
  //   endDate?: string;
  // }): Promise<{ data: string; count: number; format: string }> {
  //   const searchParams = new URLSearchParams();

  //   if (filters) {
  //     Object.entries(filters).forEach(([key, value]) => {
  //       if (value !== undefined) {
  //         searchParams.append(key, value.toString());
  //       }
  //     });
  //   }

  //   const url = searchParams.toString()
  //     ? `${API_BASE_URL}/export?${searchParams.toString()}`
  //     : `${API_BASE_URL}/export`;

  //   const response = await fetch(url);
  //   return handleResponse<{ data: string; count: number; format: string }>(response);
  // }
};

export { ExpenseApiError };
