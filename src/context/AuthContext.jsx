import React, { createContext, useState, useContext, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { api, handleResponse } from '../services/api';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAV0iouHJqp6Q0VTrMA3estpb3iy658HIY",
  authDomain: "avstore-backend.firebaseapp.com",
  projectId: "avstore-backend",
  storageBucket: "avstore-backend.firebasestorage.app",
  messagingSenderId: "646123980674",
  appId: "1:646123980674:web:9ab39cfd4c88264bfe719b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Sign up function
  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Register user in your backend using API service
      const response = await api.register({
        email,
        password,
        ...userData
      });

      const data = await handleResponse(response);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Login to your backend using API service
      const response = await api.login(idToken);
      const data = await handleResponse(response);
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setToken('');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if Firebase logout fails
      localStorage.removeItem('token');
      setToken('');
      setCurrentUser(null);
    }
  };

  // Verify token with backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api"}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };

  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        // Verify token with backend
        const isValid = await verifyToken(storedToken);
        if (!isValid) {
          localStorage.removeItem('token');
          setToken('');
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();

    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await api.login(idToken);
          
          if (response.ok) {
            const data = await handleResponse(response);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setCurrentUser(data.user);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
        }
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    token,
    signup,
    login,
    logout,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};