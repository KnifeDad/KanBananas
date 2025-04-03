import { jwtDecode, JwtPayload } from 'jwt-decode';

class AuthService {
  private token: string | null = null;
  private navigate: ((path: string) => void) | null = null;

  setNavigate(navigate: (path: string) => void) {
    this.navigate = navigate;
  }

  getToken() {
    const token = localStorage.getItem('id_token');
    console.log('Getting token:', token ? 'exists' : 'not found');
    return token;
  }

  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
    if (this.navigate) {
      this.navigate('/board');
    }
  }

  logout() {
    localStorage.removeItem('id_token');
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
    if (this.navigate) {
      this.navigate('/');
    }
  }

  loggedIn() {
    const token = this.getToken();
    if (!token) {
      console.log('No token found');
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) {
        console.log('No expiration in token');
        this.logout();
        return false;
      }

      const now = Date.now() / 1000;
      const isExpired = decoded.exp < now;
      
      console.log('Token expiration check:', {
        exp: decoded.exp,
        now,
        isExpired
      });
      
      console.log('Token expired:', isExpired);
      
      if (isExpired) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error decoding token:', err);
      this.logout();
      return false;
    }
  }
}

const auth = new AuthService();
export default auth;
