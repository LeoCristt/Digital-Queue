import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  exp: number;
  sub: string;
}

let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

// Проверка истечения срока действия токена
export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<TokenPayload>(token);
    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
};

// Обновление токена
const refreshToken = async (): Promise<string> => {
  try {
    const response = await fetch(
      "http://localhost:8000/api/auth/refresh",
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Token refresh failed");
    
    const newToken = response.headers.get("New-Access-Token");
    if (!newToken) throw new Error("New token not received");
    
    return newToken;
  } catch (error) {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
    throw error;
  }
};

// Обработчик запросов с автоматическим обновлением токена
export const authFetch = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  let accessToken = localStorage.getItem("access_token") || "";

  // Повторная попытка запроса с новым токеном
  const retryRequest = async (newToken: string): Promise<Response> => {
    const newHeaders = new Headers(init?.headers);
    newHeaders.set("Authorization", `Bearer ${newToken}`);
    
    return fetch(input, {
      ...init,
      headers: newHeaders,
      credentials: "include",
    });
  };

  // Основная логика обработки токена
  if (accessToken && isTokenExpired(accessToken)) {
    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((newToken: string) => {
          resolve(retryRequest(newToken));
        });
      });
    }

    isRefreshing = true;
    
    try {
      const newToken = await refreshToken();
      localStorage.setItem("access_token", newToken);
      
      pendingRequests.forEach((cb) => cb(newToken));
      pendingRequests = [];
      
      return retryRequest(newToken);
    } finally {
      isRefreshing = false;
    }
  }

  // Стандартный запрос
  const response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
    credentials: "include",
  });

  // Обновление токена из заголовка ответа
  const newToken = response.headers.get("New-Access-Token");
  if (newToken) localStorage.setItem("access_token", newToken);

  // Обработка 401 ошибки
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }

  return response;
};