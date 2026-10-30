
export function isLoggedIn(): boolean {
  return Boolean(
    localStorage.getItem("email") &&
    localStorage.getItem("role")
  );
}

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  return {};
}
