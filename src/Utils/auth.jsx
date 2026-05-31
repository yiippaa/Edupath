import { API_URL } from '../config';

// FUNGSI LOGOUT
export const handleLogout = async (onSuccessCallback) => {
  try {
    // Memanggil API Logout untuk menghancurkan cookie di server
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include' 
    });
  } catch (error) {
    console.warn("Gagal menghubungi server saat logout:", error);
  } finally {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_school');
    if (onSuccessCallback) onSuccessCallback();
  }
};

// FUNGSI REFRESH TOKEN (Internal)
const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include' 
    });
    
    const result = await response.json();
    
    if (result.success && result.data?.access_token) {
      localStorage.setItem('user_token', result.data.access_token);
      return result.data.access_token;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// FUNGSI FETCH OTOMATIS (Custom Fetch)
export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem('user_token');
  
  // header default
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  // request pertama
  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });

  // response 401 (Unauthorized / Token Expired)
  if (response.status === 401) {
    console.log("Token expired, mencoba refresh token...");
    const newToken = await refreshToken();
    
    if (newToken) {
      // Jika berhasil dapat token baru, update header dan ulangi request yang tadi gagal!
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers, credentials: 'include' });
    } else {
      // Jika refresh token juga gagal (mungkin cookie kedaluwarsa), paksa user logout
      console.log("Refresh token gagal, user harus login ulang.");
      handleLogout(() => {
        window.location.reload(); 
      });
    }
  }

  return response;
};