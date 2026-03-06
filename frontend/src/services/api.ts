/**
 * LearnFlow API Service Layer
 * Handles all API calls to backend services
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface ChatMessage {
  user_id: string;
  message: string;
  context?: Record<string, any>;
}

interface ChatResponse {
  response: string;
  routed_to: string;
  confidence: number;
}

interface CodeExecutionRequest {
  code: string;
  user_id: string;
  exercise_id?: string;
}

interface CodeExecutionResult {
  output: string;
  error?: string;
  success: boolean;
}

interface Progress {
  user_id: string;
  module_id: string;
  topic: string;
  mastery_score: number;
  status: string;
  exercises_completed: number;
  quizzes_completed: number;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on init
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('learnflow_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // ==================== Authentication ====================

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    return this.handleAuthResponse(data);
  }

  async register(data: { name: string; email: string; password: string; role: string }): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Registration failed');
    }

    const result = await response.json();
    return this.handleAuthResponse(result);
  }

  private handleAuthResponse(data: LoginResponse): LoginResponse {
    this.token = data.access_token;

    if (typeof window !== 'undefined') {
      localStorage.setItem('learnflow_token', data.access_token);
      localStorage.setItem('learnflow_user', JSON.stringify(data.user));
    }

    return data;
  }

  logout(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('learnflow_token');
      localStorage.removeItem('learnflow_user');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): any | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('learnflow_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // ==================== Chat ====================

  async sendChatMessage(message: ChatMessage): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  // ==================== Code Execution ====================

  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResult> {
    const response = await fetch(`${API_BASE_URL}/api/code/execute`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Code execution failed');
    }

    return response.json();
  }

  // ==================== Progress ====================

  async getProgress(userId: string, moduleId?: string): Promise<{ progress: Progress[] }> {
    const url = moduleId
      ? `${API_BASE_URL}/api/progress/${userId}?module_id=${moduleId}`
      : `${API_BASE_URL}/api/progress/${userId}`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      return { progress: [] };
    }

    return response.json();
  }

  async submitExercise(exerciseId: string, code: string, userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/submissions/track`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        user_id: userId,
        exercise_id: exerciseId,
        code: code,
        success: true,
      }),
    });

    if (!response.ok) throw new Error('Failed to track submission');
    return response.json();
  }

  async getSubmissionHistory(userId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/submissions/${userId}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) return [];
    return response.json();
  }

  // ==================== Teacher Dashboard ====================

  async getTeacherAnalytics(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/teacher/analytics`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) return [];
    return response.json();
  }

  async getTeacherAlerts(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/teacher/alerts`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) return [];
    return response.json();
  }

  async getTeacherStudents(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/teacher/students`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) return [];
    return response.json();
  }

  async getTeacherStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/teacher/stats`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) return { active_entities: '0', avg_mastery: '0%', fault_alerts: 0, logic_loops: '0' };
    return response.json();
  }

  // ==================== Exercise ====================

  async generateExercise(topic: string, difficulty: string, userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/exercise/generate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        topic,
        difficulty,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate exercise');
    }

    return response.json();
  }

  async submitQuiz(quizId: string, answers: number[], userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        quiz_id: quizId,
        user_id: userId,
        answers,
      }),
    });

    if (!response.ok) throw new Error('Failed to submit quiz');
    return response.json();
  }

  async reviewCode(code: string, userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/code/review`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        code,
        user_id: userId,
      }),
    });

    if (!response.ok) throw new Error('Code review failed');
    return response.json();
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
