import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, profileData) => {
    console.log('Starting signup for:', email);
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Firebase Auth user created:', result.user.uid);

    try {
      await updateProfile(result.user, { displayName: profileData.displayName });
    } catch (e) {
      console.warn('updateProfile failed (non-critical):', e);
    }
    
    const userDoc = {
      uid: result.user.uid,
      email,
      displayName: profileData.displayName,
      username: profileData.username,
      age: profileData.age,
      gender: profileData.gender,
      preferredGender: profileData.preferredGender,
      bio: profileData.bio || '',
      interests: profileData.interests || [],
      city: profileData.city || '',
      region: profileData.region || '',
      photoURL: profileData.photoURL || '',
      mood: 'happy',
      communicationMode: 'text',
      isOnline: true,
      isPremium: false,
      premiumPlan: null,
      premiumExpiry: null,
      privacy: {
        location: 'city',
        profile: 'everyone',
      },
      blockedUsers: [],
      dailyMatchCount: 0,
      dailyChatRequests: 0,
      lastMatchReset: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      // Add timeout so signup doesn't hang if Firestore DB doesn't exist
      const firestoreWrite = setDoc(doc(db, 'users', result.user.uid), userDoc);
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore write timed out — is the Firestore Database created in Firebase Console?')), 5000)
      );
      await Promise.race([firestoreWrite, timeout]);
      console.log('Firestore user doc created');
    } catch (e) {
      console.warn('Firestore setDoc failed or timed out:', e.message);
      // Still allow signup even if Firestore write fails — auth user was created
    }
    
    setUserProfile(userDoc);
    return result;
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    try {
      const writePromise = updateDoc(doc(db, 'users', result.user.uid), { isOnline: true, updatedAt: serverTimestamp() });
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000));
      await Promise.race([writePromise, timeout]);
    } catch (e) {
      console.warn('Firestore update on login failed (non-critical):', e.message);
    }
    return result;
  };

  const logout = async () => {
    if (currentUser) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), { isOnline: false, updatedAt: serverTimestamp() });
      } catch (e) { /* ignore */ }
    }
    setUserProfile(null);
    return signOut(auth);
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const fetchUserProfile = async (uid) => {
    try {
      const readPromise = getDoc(doc(db, 'users', uid));
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000));
      const docSnap = await Promise.race([readPromise, timeout]);
      if (docSnap.exists()) {
        const profile = { ...docSnap.data(), uid };
        setUserProfile(profile);
        return profile;
      }
    } catch (e) {
      console.warn('fetchUserProfile failed or timed out:', e.message);
    }
    return null;
  };

  const updateUserProfile = async (data) => {
    if (!currentUser) return;
    const updateData = { ...data, updatedAt: serverTimestamp() };
    try {
      const writePromise = updateDoc(doc(db, 'users', currentUser.uid), updateData);
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000));
      await Promise.race([writePromise, timeout]);
    } catch (e) {
      console.warn('updateUserProfile failed:', e.message);
    }
    setUserProfile(prev => ({ ...prev, ...updateData }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    fetchUserProfile,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
