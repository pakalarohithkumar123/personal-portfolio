
const API_URL = "http://localhost:8081/api/auth";

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  id?: number;
  userId?: number;
  name: string;
  email: string;
  role: string;
  message: string;
}

async function readResponse(response: Response) {
  const text = await response.text();

  let result: any = {};
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = { message: text };
  }

  if (!response.ok) {
    const message =
      result.message ||
      result.error ||
      result.detail ||
      (typeof result === "string" ? result : "") ||
      `HTTP ${response.status}: ${response.statusText}`;

    throw new Error(
      `Request failed (${response.status}): ${message}`
    );
  }

  return result;
}

export async function signup(
  data: SignupData
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
    }),
  });

  return readResponse(response);
}

export async function signin(
  data: SigninData
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email.trim(),
      password: data.password,
    }),
  });

  return readResponse(response);
}
