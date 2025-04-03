import { API_URL } from "./config";

interface Credentials {
  username: string;
  password: string;
}

const register = async (credentials: Credentials) => {
  try {
    console.log('Attempting registration with:', credentials);
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('Registration response status:', response.status);
    const data = await response.json();
    console.log('Registration response data:', data);

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status} ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

const login = async (credentials: Credentials) => {
  try {
    console.log('Attempting login with:', credentials);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
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
    console.error('Failed to login', error);
    throw error;
  }
};

export { register, login };
