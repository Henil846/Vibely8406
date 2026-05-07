import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI, setToken, removeToken } from '../utils/api';

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

  // Restore session on mount by checking if we have a valid token
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('vibely_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await userAPI.getMe();
        if (data.user) {
          setCurrentUser({ uid: data.user._id, email: data.user.email });
          setUserProfile(mapBackendUser(data.user));
        }
      } catch (err) {
        // Token invalid/expired, clean up
        removeToken();
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Map backend user fields to what frontend expects
  const mapBackendUser = (user) => ({
    uid: user._id,
    email: user.email,
    displayName: user.displayName || user.fullname || '',
    username: user.username || '',
    age: user.age || '',
    gender: user.gender || '',
    preferredGender: user.talk_with || user.preferredGender || 'everyone',
    bio: user.bio || '',
    interests: user.interests || [],
    city: user.city || '',
    region: user.state || '',
    photoURL: user.profilePhoto || '',
    mood: user.mood || 'happy',
    communicationMode: user.communicationMode || 'text',
    isOnline: user.isOnline || false,
    isPremium: user.isPremium || false,
    premiumPlan: user.premiumPlan || null,
    premiumExpiry: user.premiumExpiry || null,
    privacy: user.privacy || { location: 'city', profile: 'everyone' },
    followApproval: user.followApproval || 'auto',
    blockedUsers: user.blockedUsers || [],
    connectionCount: user.connectionCount || 0,
    followersCount: user.followersCount || 0,
    followingCount: user.followingCount || 0,
    connections: user.connections || [],
    followers: user.followers || [],
    following: user.following || [],
    dailyMatchCount: user.dailyMatchCount || 0,
    dailyChatRequests: user.dailyChatRequests || 0,
    lastMatchReset: user.lastMatchReset || new Date().toISOString(),
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || new Date().toISOString(),
  });

  const signup = async (email, password, profileData) => {
    const payload = {
      email,
      password,
      fullname: profileData.displayName || '',
      displayName: profileData.displayName || '',
      username: profileData.username || '',
      phone: profileData.phone || '',
      age: profileData.age || '',
      gender: profileData.gender || '',
      preferredGender: profileData.preferredGender || 'everyone',
      bio: profileData.bio || '',
      interests: profileData.interests || [],
      city: profileData.city || '',
      region: profileData.region || '',
      profilePhoto: profileData.photoURL || '',
    };

    const data = await authAPI.register(payload);

    // Store JWT token in localStorage
    if (data.token) {
      setToken(data.token);
    }

    const mappedUser = mapBackendUser(data.user);
    setCurrentUser({ uid: data.user._id, email: data.user.email });
    setUserProfile(mappedUser);
    return { user: { uid: data.user._id, email: data.user.email } };
  };

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);

    // Store JWT token in localStorage
    if (data.token) {
      setToken(data.token);
    }

    const mappedUser = mapBackendUser(data.user);
    setCurrentUser({ uid: data.user._id, email: data.user.email });
    setUserProfile(mappedUser);
    return { user: { uid: data.user._id, email: data.user.email } };
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Logout even if API fails
    }
    removeToken();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const resetPassword = async (email) => {
    // TODO: implement password reset on backend
    return true;
  };

  const fetchUserProfile = async (uid) => {
    try {
      const data = await userAPI.getMe();
      if (data.user) {
        const mapped = mapBackendUser(data.user);
        setUserProfile(mapped);
        return mapped;
      }
    } catch (err) {
      console.error('fetchUserProfile error:', err);
    }
    return null;
  };

  const updateUserProfile = async (updates) => {
    if (!currentUser) return;

    // Map frontend fields to backend fields
    const payload = { ...updates };
    if (payload.preferredGender !== undefined) {
      payload.talk_with = payload.preferredGender;
    }
    if (payload.region !== undefined) {
      payload.state = payload.region;
    }
    if (payload.photoURL !== undefined) {
      payload.profilePhoto = payload.photoURL;
    }

    try {
      const data = await userAPI.updateProfile(payload);
      if (data.user) {
        const mapped = mapBackendUser(data.user);
        setUserProfile(mapped);
      }
    } catch (err) {
      console.error('updateUserProfile error:', err);
      throw err;
    }
  };

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
