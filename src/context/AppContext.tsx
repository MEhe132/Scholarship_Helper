'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, ApplicationCard, DocumentItem, Authority, DuplicateNotice, ApplicationStatus, AuthUser, RegisteredUser } from '../lib/types';
import { authoritiesData } from '../data/authoritiesData';

interface AppContextType {
  currentUser: AuthUser | null;
  registeredUsers: RegisteredUser[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  prefilledUserId: string;
  setPrefilledUserId: (id: string) => void;

  signUp: (userId: string, password: string, fullName: string) => { success: boolean; error?: string };
  login: (userId: string, password: string) => { success: boolean; error?: string };
  logout: () => void;

  userProfile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  pinnedShortCodes: string[];
  togglePin: (shortCode: string) => void;
  isPinned: (shortCode: string) => boolean;
  applications: ApplicationCard[];
  addToTracker: (authority: Authority, programName?: string) => void;
  addCustomApplication: (card: ApplicationCard) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  deleteApplication: (id: string) => void;
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (id: string) => void;
  seenNewsIds: string[];
  markNewsAsSeen: (id: string) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  activeDuplicateModal: { title: string; notices: DuplicateNotice[] } | null;
  setActiveDuplicateModal: (modal: { title: string; notices: DuplicateNotice[] } | null) => void;
}

const initialRegisteredUsers: RegisteredUser[] = [];

const defaultProfile: UserProfile = {
  id: 'user-profile-default',
  fullName: '',
  currentDegree: 'BSc in Computer Science',
  currentMajor: 'Computer Science',
  cgpa: 0,
  cgpaScale: 4.00,
  ieltsScore: undefined,
  greQuant: undefined,
  greVerbal: undefined,
  targetDegree: ['MSc', 'PhD'],
  preferredCountries: [],
  fundingPreference: 'both',
  expectedGraduationYear: 2026,
  targetIntake: 'Fall 2026',
};

const defaultApplications: ApplicationCard[] = [];

const defaultDocuments: DocumentItem[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [prefilledUserId, setPrefilledUserId] = useState('');

  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [pinnedShortCodes, setPinnedShortCodes] = useState<string[]>([]);
  const [applications, setApplications] = useState<ApplicationCard[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [seenNewsIds, setSeenNewsIds] = useState<string[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [activeDuplicateModal, setActiveDuplicateModal] = useState<{ title: string; notices: DuplicateNotice[] } | null>(null);

  // Load from localStorage on client mount (with complete session reset)
  useEffect(() => {
    try {
      // ONE-TIME FORCED PURGE OF ALL PAST SESSIONS & TEST DATA
      const sessionResetDone = localStorage.getItem('gsh_session_reset_v2');
      if (!sessionResetDone) {
        localStorage.removeItem('gsh_active_session');
        localStorage.removeItem('gsh_auth_user');
        localStorage.removeItem('gsh_users_db');
        localStorage.removeItem('gsh_user_profile');
        localStorage.removeItem('gsh_pinned_codes');
        localStorage.removeItem('gsh_applications');
        localStorage.removeItem('gsh_documents');
        localStorage.setItem('gsh_session_reset_v2', 'true');
        setCurrentUser(null);
        setRegisteredUsers([]);
        setPinnedShortCodes([]);
        setApplications([]);
        setDocuments([]);
        return;
      }

      // 1. Registered Users database inside website
      const savedUsers = localStorage.getItem('gsh_users_db');
      if (savedUsers) {
        const parsedUsers: RegisteredUser[] = JSON.parse(savedUsers);
        setRegisteredUsers(parsedUsers);
      }

      // 2. Active Session (Only if explicitly logged in by user)
      const savedSession = localStorage.getItem('gsh_active_session');
      if (savedSession) {
        const parsedSession: AuthUser = JSON.parse(savedSession);
        setCurrentUser(parsedSession);
      } else {
        setCurrentUser(null);
      }

      // 3. User Profile
      const savedProfile = localStorage.getItem('gsh_user_profile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setUserProfile(parsedProfile);
      }

      // 4. Saved Pins
      const savedPins = localStorage.getItem('gsh_pinned_codes');
      if (savedPins) {
        const parsedPins: string[] = JSON.parse(savedPins);
        setPinnedShortCodes(parsedPins);
      }

      // 5. Applications
      const savedApps = localStorage.getItem('gsh_applications');
      if (savedApps) {
        const parsedApps: ApplicationCard[] = JSON.parse(savedApps);
        setApplications(parsedApps);
      }

      // 6. Documents
      const savedDocs = localStorage.getItem('gsh_documents');
      if (savedDocs) {
        const parsedDocs: DocumentItem[] = JSON.parse(savedDocs);
        setDocuments(parsedDocs);
      }

      const savedNews = localStorage.getItem('gsh_seen_news');
      if (savedNews) setSeenNewsIds(JSON.parse(savedNews));
    } catch (e) {
      console.warn('Initialization error:', e);
    }
  }, []);

  // =========================================================================
  // AUTHENTICATION: STEP 1 - SIGN UP FIRST (Saves user to DB, does NOT log in)
  // =========================================================================
  const signUp = (userId: string, password: string, fullName: string) => {
    const cleanId = userId.trim().toLowerCase();
    const cleanName = fullName.trim() || cleanId;

    if (!cleanId) {
      return { success: false, error: 'Please choose a User ID / Username.' };
    }

    if (cleanId.length < 3) {
      return { success: false, error: 'User ID must be at least 3 characters long.' };
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanId)) {
      return { success: false, error: 'User ID can only contain letters, numbers, underscores, and hyphens.' };
    }

    if (!password || password.length < 5) {
      return { success: false, error: 'Password must be at least 5 characters long.' };
    }

    // Check if User ID already exists in database
    const exists = registeredUsers.some(u => u.userId.toLowerCase() === cleanId);
    if (exists) {
      return { success: false, error: `User ID "${cleanId}" is already taken. Please choose another.` };
    }

    // Create new user record
    const newUser: RegisteredUser = {
      id: `usr-${Date.now()}`,
      userId: cleanId,
      fullName: cleanName,
      password: password,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [newUser, ...registeredUsers];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('gsh_users_db', JSON.stringify(updatedUsers));

    // Notice: We do NOT log the user in directly!
    return { success: true };
  };

  // =========================================================================
  // AUTHENTICATION: STEP 2 - LOG IN (Checks database for User ID and Password)
  // =========================================================================
  const login = (userId: string, password: string) => {
    const cleanId = userId.trim().toLowerCase();

    if (!cleanId) {
      return { success: false, error: 'Please enter your User ID.' };
    }

    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Look up in database
    const foundUser = registeredUsers.find(u => u.userId.toLowerCase() === cleanId);

    if (!foundUser) {
      return { 
        success: false, 
        error: `User ID "${userId}" not found in database. Please click "Sign Up" to create an account first!` 
      };
    }

    if (foundUser.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    // Log the user in & save active session inside website
    const authSession: AuthUser = {
      id: foundUser.id,
      userId: foundUser.userId,
      fullName: foundUser.fullName,
      createdAt: foundUser.createdAt,
    };

    setCurrentUser(authSession);
    localStorage.setItem('gsh_active_session', JSON.stringify(authSession));
    updateProfile({ fullName: foundUser.fullName });

    return { success: true };
  };

  // LOG OUT (Clears active session)
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gsh_active_session');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('gsh_user_profile', JSON.stringify(next));
      return next;
    });
  };

  const togglePin = (shortCode: string) => {
    setPinnedShortCodes((prev) => {
      const next = prev.includes(shortCode)
        ? prev.filter((code) => code !== shortCode)
        : [shortCode, ...prev];
      localStorage.setItem('gsh_pinned_codes', JSON.stringify(next));
      return next;
    });
  };

  const isPinned = (shortCode: string) => pinnedShortCodes.includes(shortCode);

  const addToTracker = (authority: Authority, programName?: string) => {
    const newApp: ApplicationCard = {
      id: `app-${Date.now()}`,
      authorityShortCode: authority.shortCode,
      scholarshipTitle: programName || `${authority.shortCode} Higher Study Track`,
      universityName: authority.name,
      country: authority.country,
      countryFlag: authority.countryFlag,
      status: 'shortlisted',
      deadline: '2026-06-30',
      notes: `Targeting ${authority.tuitionType}. Work rights: ${authority.workRightsText}`,
      updatedAt: 'Just now'
    };

    setApplications((prev) => {
      const next = [newApp, ...prev];
      localStorage.setItem('gsh_applications', JSON.stringify(next));
      return next;
    });
  };

  const addCustomApplication = (card: ApplicationCard) => {
    setApplications((prev) => {
      const next = [card, ...prev];
      localStorage.setItem('gsh_applications', JSON.stringify(next));
      return next;
    });
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus) => {
    setApplications((prev) => {
      const next = prev.map((app) => (app.id === id ? { ...app, status, updatedAt: 'Just now' } : app));
      localStorage.setItem('gsh_applications', JSON.stringify(next));
      return next;
    });
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => {
      const next = prev.filter((app) => app.id !== id);
      localStorage.setItem('gsh_applications', JSON.stringify(next));
      return next;
    });
  };

  const addDocument = (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: 'Just now'
    };
    setDocuments((prev) => {
      const next = [newDoc, ...prev];
      localStorage.setItem('gsh_documents', JSON.stringify(next));
      return next;
    });
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => {
      const next = prev.filter((doc) => doc.id !== id);
      localStorage.setItem('gsh_documents', JSON.stringify(next));
      return next;
    });
  };

  const markNewsAsSeen = (id: string) => {
    setSeenNewsIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem('gsh_seen_news', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        registeredUsers,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        prefilledUserId,
        setPrefilledUserId,

        signUp,
        login,
        logout,

        userProfile,
        updateProfile,
        pinnedShortCodes,
        togglePin,
        isPinned,
        applications,
        addToTracker,
        addCustomApplication,
        updateApplicationStatus,
        deleteApplication,
        documents,
        addDocument,
        deleteDocument,
        seenNewsIds,
        markNewsAsSeen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        activeDuplicateModal,
        setActiveDuplicateModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
