import { UserLogin } from "../interfaces/UserLogin";
import { API_URL } from "./config";

const register = async (userInfo: UserLogin) => {
  try {
    console.log('Attempting registration with:', userInfo);
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status} ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

const login = async (userInfo: UserLogin) => {
  try {
    console.log('Attempting login with:', userInfo);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export { login, register };
