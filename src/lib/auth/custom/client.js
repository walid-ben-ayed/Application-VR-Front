'use client';

import { Login } from '@/Actions/AuthentificationActions';
import { TokenExpired } from '@/Actions/UiActions';


function generateToken() {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: localStorage.getItem('username'),
  lastName: 'Rivers',
  email: localStorage.getItem('username'),
};

class AuthClient {
  async signUp(_) {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_) {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params, dispatch) {
    const { email, password } = params;

    try {
      // Renommer la variable pour éviter le conflit
      const authenticatedUser = await Login({ email, password }, dispatch);
      return { user: authenticatedUser }; // Retourner en tant que "user" si nécessaire
    } catch (error) {
      return { error: error.message || "Erreur d'authentification" };
    }
  }
  
  

  async resetPassword(_) {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_) {
    return { error: 'Update reset not implemented' };
  }

  async getUser() {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut() {
    TokenExpired();

    return {};
  }
}

export const authClient = new AuthClient();
