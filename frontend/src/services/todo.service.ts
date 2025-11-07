import apiClient from "@/lib/api-client";

export interface TodoItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: number;
  due_date?: string;
  completed_at?: string;
  created_at: string;
}

export interface CreateTodoItem {
  title: string;
  description?: string;
  priority?: number;
  due_date?: string;
}

export interface UpdateTodoItem {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: number;
  due_date?: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completion_rate: number;
}

class TodoService {
  async createTodo(data: CreateTodoItem): Promise<TodoItem> {
    const response = await apiClient.post<TodoItem>('/v1/todos', data);
    return response.data;
  }

  async getTodos(params?: { completed?: boolean }): Promise<TodoItem[]> {
    const response = await apiClient.get<TodoItem[]>('/v1/todos', { params });
    return response.data;
  }

  async updateTodo(id: string, data: UpdateTodoItem): Promise<TodoItem> {
    const response = await apiClient.put<TodoItem>(`/v1/todos/${id}`, data);
    return response.data;
  }

  async deleteTodo(id: string): Promise<void> {
    await apiClient.delete(`'v1/todos/${id}`);
  }

  async getTodoStats(): Promise<TodoStats> {
    const response = await apiClient.get<TodoStats>('/v1/todos/stats/summary');
    return response.data;
  }
}

export const todoService = new TodoService();