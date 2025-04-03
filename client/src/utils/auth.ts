import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  loggedIn() {
    const token = this.getToken();
    if (!token) {
      console.log('No token found');
      return false;
    }
    try {
      const isExpired = this.isTokenExpired(token);
      console.log('Token expired:', isExpired);
      return !isExpired;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }
  
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) {
        console.log('No expiration in token');
        return true;
      }
      const isExpired = decoded.exp * 1000 < Date.now();
      console.log('Token expiration check:', { exp: decoded.exp, now: Date.now(), isExpired });
      return isExpired;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  getToken(): string {
    return localStorage.getItem('id_token') || '';
  }

  login(idToken: string) {
    console.log('Logging in with token');
    localStorage.setItem('id_token', idToken);
    window.location.href = '/board';
  }

  logout() {
    console.log('Logging out, removing token');
    localStorage.removeItem('id_token');
    window.location.href = '/';
  }
}

export default new AuthService();
