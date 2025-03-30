import Cookies from "universal-cookie";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/memberships`;

export type SignupData = {
  email: string;
  username: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  data: {
    accessToken: string;
  };
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const authResponse = await response.json();

  const cookies = new Cookies();
  cookies.set("accessToken", authResponse.data.accessToken, {
    maxAge: 7 * 24 * 60 * 60,
  });

  return authResponse;
};

export const logout = async (): Promise<void> => {
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      // handleUnauthorized();
      return;
    }
    throw new Error("Logout gagal");
  }

  cookies.remove("accessToken", { path: "/" });
};

// const handleUnauthorized = () => {
//   const cookies = new Cookies();
//   cookies.remove("accessToken", { path: "/" });
//   window.location.href = "/login";
// };

// export { handleUnauthorized };
