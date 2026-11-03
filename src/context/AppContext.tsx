'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, ApplicationCard, DocumentItem, Authority, DuplicateNotice, ApplicationStatus, AuthUser, RegisteredAccount } from '../lib/types';
import { authoritiesData } from '../data/authoritiesData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface AppContextType {
  currentUser: AuthUser | null;
  registeredAccounts: RegisteredAccount[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  prefilledIdentifier: string;
  setPrefilledIdentifier: (id: string) => void;

  registerWithGoogle: (email: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  registerWithPassword: (identifier: string, email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (email?: string) => Promise<{ success: boolean; error?: string; registeredEmails?: string[] }>;
  loginWithPassword: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;

  userProfile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  pinnedShortCodes: string[];
  togglePin: (shortCode: string) => void;
  isPinned: (shortCode: string) => boolean;
  applications: ApplicationCard[];
  addToTracker: (authority: Authority, programName?: string) => void;
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

const initialRegisteredAccounts: RegisteredAccount[] = [
  {
    id: 'user-demo-google',
    identifier: 'mhbhuiyan132@gmail.com',
    email: 'mhbhuiyan132@gmail.com',
    fullName: 'Mehedi Hasan',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    provider: 'google',
    createdAt: '2026-11-01T10:00:00Z',
  },
  {
    id: 'user-demo-id',
    identifier: 'cs_student',
    email: 'student@cs.university.edu',
    fullName: 'CS Undergrad (3rd Year)',
    password: 'password123',
    provider: 'email',
    createdAt: '2026-11-01T11:00:00Z',
  }
];

const defaultProfile: UserProfile = {
  id: 'user-demo-1',
  fullName: 'CS Undergrad (3rd Year)',
  currentDegree: 'BSc in Computer Science',
  currentMajor: 'Computer Science & Engineering',
  cgpa: 3.50,
  cgpaScale: 4.00,
  ieltsScore: 7.0,
  greQuant: 164,
  greVerbal: 154,
  targetDegree: ['MSc', 'PhD', 'Direct PhD'],
  preferredCountries: ['Germany', 'European Union', 'United States', 'Italy', 'South Korea'],
  fundingPreference: 'both',
  expectedGraduationYear: 2026,
  targetIntake: 'Fall 2026 / Spring 2027',
};

const defaultApplications: ApplicationCard[] = [
  {
    id: 'app-1',
    authorityShortCode: 'DAAD',
    scholarshipTitle: 'MSc Computer Science (Tuition-Free)',
    universityName: 'Technical University of Munich (TUM)',
    country: 'Germany',
    countryFlag: '🇩🇪',
    status: 'preparing',
    deadline: '2026-05-31',
    notes: 'Preparing VPD with Uni-Assist. Checking Werkstudent options in Munich tech ecosystem.',
    updatedAt: '2 days ago'
  },
  {
    id: 'app-2',
    authorityShortCode: 'EMJM',
    scholarshipTitle: 'EMJM BDMA (Big Data Management & Analytics)',
    universityName: 'ULB Brussels & TU Eindhoven Consortium',
    country: 'European Union',
    countryFlag: '🇪🇺',
    status: 'shortlisted',
    deadline: '2026-01-15',
    notes: 'Drafting SOP. Emphasizing final year database project.',
    updatedAt: '1 day ago'
  },
  {
    id: 'app-3',
    authorityShortCode: 'DSU_ITALY',
    scholarshipTitle: 'MSc Computer Science & Engineering (DSU Grant)',
    universityName: 'Politecnico di Milano',
    country: 'Italy',
    countryFlag: '🇮🇹',
    status: 'shortlisted',
    deadline: '2026-02-28',
    notes: 'Requested family composition and income certificates for ISEE-Parificato calculation.',
    updatedAt: '3 days ago'
  }
];

const defaultDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    fileName: 'Academic_CV_CS_Candidate_2026.pdf',
    fileCategory: 'cv',
    fileSizeKb: 142,
    fileUrl: '#',
    uploadedAt: 'Today, 10:20 AM',
    notes: '1-page LaTeX format targeting European & US CS labs.'
  },
  {
    id: 'doc-2',
    fileName: 'SOP_Draft_v2_DistributedSystems.docx',
    fileCategory: 'sop',
    fileSizeKb: 88,
    fileUrl: '#',
    uploadedAt: 'Yesterday, 03:45 PM',
    notes: 'Tailored for German tuition-free universities and Erasmus BDMA.'
  },
  {
    id: 'doc-3',
    fileName: 'Undergrad_Transcript_Sem1-Sem5_Official.pdf',
    fileCategory: 'transcript',
    fileSizeKb: 340,
    fileUrl: '#',
    uploadedAt: '3 days ago',
    notes: 'Official semester 1 to 5 grades. Current CGPA: 3.50/4.00.'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(initialRegisteredAccounts);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [prefilledIdentifier, setPrefilledIdentifier] = useState('');

  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [pinnedShortCodes, setPinnedShortCodes] = useState<string[]>(['DAAD', 'EMJM']);
  const [applications, setApplications] = useState<ApplicationCard[]>(defaultApplications);
  const [documents, setDocuments] = useState<DocumentItem[]>(defaultDocuments);
  const [seenNewsIds, setSeenNewsIds] = useState<string[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [activeDuplicateModal, setActiveDuplicateModal] = useState<{ title: string; notices: DuplicateNotice[] } | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedRegistered = localStorage.getItem('gsh_registered_accounts');
      if (savedRegistered) {
        setRegisteredAccounts(JSON.parse(savedRegistered));
      } else {
        localStorage.setItem('gsh_registered_accounts', JSON.stringify(initialRegisteredAccounts));
      }

      const savedUser = localStorage.getItem('gsh_auth_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const savedProfile = localStorage.getItem('gsh_user_profile');
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));

      const savedPins = localStorage.getItem('gsh_pinned_codes');
      if (savedPins) setPinnedShortCodes(JSON.parse(savedPins));

      const savedApps = localStorage.getItem('gsh_applications');
      if (savedApps) setApplications(JSON.parse(savedApps));

      const savedDocs = localStorage.getItem('gsh_documents');
      if (savedDocs) setDocuments(JSON.parse(savedDocs));

      const savedNews = localStorage.getItem('gsh_seen_news');
      if (savedNews) setSeenNewsIds(JSON.parse(savedNews));

      // Listen to live Supabase session if configured
      if (isSupabaseConfigured() && supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            const sbUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              avatarUrl: session.user.user_metadata?.avatar_url,
              provider: (session.user.app_metadata?.provider as any) || 'email',
              createdAt: session.user.created_at,
            };
            setCurrentUser(sbUser);
            localStorage.setItem('gsh_auth_user', JSON.stringify(sbUser));
          }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const sbUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              avatarUrl: session.user.user_metadata?.avatar_url,
              provider: (session.user.app_metadata?.provider as any) || 'email',
              createdAt: session.user.created_at,
            };
            setCurrentUser(sbUser);
            localStorage.setItem('gsh_auth_user', JSON.stringify(sbUser));
          } else {
            setCurrentUser(null);
            localStorage.removeItem('gsh_auth_user');
          }
        });

        return () => subscription.unsubscribe();
      }
    } catch (e) {
      console.warn('Initialization error:', e);
    }
  }, []);

  // STEP 1: SIGN UP WITH GOOGLE (Registers the account, does NOT auto-login)
  const registerWithGoogle = async (email: string, fullName: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid Google email address.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim() || cleanEmail.split('@')[0];

    // Check if already registered
    const exists = registeredAccounts.some(acc => acc.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { 
        success: false, 
        error: `An account for ${cleanEmail} is already registered! Please sign in with Google directly.` 
      };
    }

    if (isSupabaseConfigured() && supabase) {
      // In Supabase, OAuth sign in will create the account
      return { success: true };
    }

    // Register new Google account
    const newGoogleAcc: RegisteredAccount = {
      id: `google-${Date.now()}`,
      identifier: cleanEmail,
      email: cleanEmail,
      fullName: cleanName,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      provider: 'google',
      createdAt: new Date().toISOString(),
    };

    const updated = [newGoogleAcc, ...registeredAccounts];
    setRegisteredAccounts(updated);
    localStorage.setItem('gsh_registered_accounts', JSON.stringify(updated));

    // Notice: We DO NOT set currentUser here!
    // The user must now sign in using their registered account.
    return { success: true };
  };

  // STEP 1: SIGN UP WITH PASSWORD (Registers the account, does NOT auto-login)
  const registerWithPassword = async (identifier: string, email: string, password: string, fullName: string) => {
    if (!identifier || !password || !fullName) {
      return { success: false, error: 'All fields (Full Name, User ID/Email, and Password) are required.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const cleanId = identifier.trim().toLowerCase();
    const cleanEmail = (email || identifier).trim().toLowerCase();
    const cleanName = fullName.trim();

    // Check if already registered
    const exists = registeredAccounts.some(
      acc => acc.identifier.toLowerCase() === cleanId || acc.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      return { 
        success: false, 
        error: 'An account with this User ID or Email is already registered. Please sign in.' 
      };
    }

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: { full_name: cleanName, user_id: cleanId },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }

    // Register new User ID account
    const newAccount: RegisteredAccount = {
      id: `user-${Date.now()}`,
      identifier: cleanId,
      email: cleanEmail.includes('@') ? cleanEmail : `${cleanId}@student.university.edu`,
      fullName: cleanName,
      password: password,
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    const updated = [newAccount, ...registeredAccounts];
    setRegisteredAccounts(updated);
    localStorage.setItem('gsh_registered_accounts', JSON.stringify(updated));

    // Notice: We DO NOT set currentUser here!
    return { success: true };
  };

  // STEP 2: LOG IN WITH GOOGLE (Must be already signed up!)
  const loginWithGoogle = async (email?: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }

    // Check registered Google accounts
    const googleAccounts = registeredAccounts.filter(acc => acc.provider === 'google');

    if (googleAccounts.length === 0) {
      return { 
        success: false, 
        error: 'No registered Google accounts found! Please create an account via Sign Up first.' 
      };
    }

    let targetAccount = googleAccounts[0];
    if (email) {
      const found = googleAccounts.find(acc => acc.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) {
        return {
          success: false,
          error: `Google account ${email} is not registered yet. Please sign up first.`,
          registeredEmails: googleAccounts.map(a => a.email),
        };
      }
      targetAccount = found;
    }

    const authedUser: AuthUser = {
      id: targetAccount.id,
      email: targetAccount.email,
      fullName: targetAccount.fullName,
      avatarUrl: targetAccount.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      provider: 'google',
      createdAt: targetAccount.createdAt,
    };

    setCurrentUser(authedUser);
    localStorage.setItem('gsh_auth_user', JSON.stringify(authedUser));
    updateProfile({ fullName: targetAccount.fullName });

    return { success: true, registeredEmails: googleAccounts.map(a => a.email) };
  };

  // STEP 2: LOG IN WITH USER ID / EMAIL & PASSWORD (Must be already signed up!)
  const loginWithPassword = async (identifier: string, password: string) => {
    if (!identifier || !password) {
      return { success: false, error: 'Please enter both your User ID / Email and password.' };
    }

    const cleanId = identifier.trim().toLowerCase();

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanId,
        password: password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const authedUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || cleanId,
          fullName: data.user.user_metadata?.full_name || cleanId.split('@')[0],
          provider: 'email',
          createdAt: data.user.created_at,
        };
        setCurrentUser(authedUser);
        localStorage.setItem('gsh_auth_user', JSON.stringify(authedUser));
      }
      return { success: true };
    }

    // Verify against registered accounts
    const account = registeredAccounts.find(
      acc => acc.identifier.toLowerCase() === cleanId || acc.email.toLowerCase() === cleanId
    );

    if (!account) {
      return { 
        success: false, 
        error: `No account found for "${identifier}". Please create an account via Sign Up first.` 
      };
    }

    if (account.password && account.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    const authedUser: AuthUser = {
      id: account.id,
      email: account.email,
      fullName: account.fullName,
      avatarUrl: account.avatarUrl,
      provider: account.provider,
      createdAt: account.createdAt,
    };

    setCurrentUser(authedUser);
    localStorage.setItem('gsh_auth_user', JSON.stringify(authedUser));
    updateProfile({ fullName: account.fullName });

    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    localStorage.removeItem('gsh_auth_user');
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
        registeredAccounts,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        prefilledIdentifier,
        setPrefilledIdentifier,

        registerWithGoogle,
        registerWithPassword,
        loginWithGoogle,
        loginWithPassword,
        logout,

        userProfile,
        updateProfile,
        pinnedShortCodes,
        togglePin,
        isPinned,
        applications,
        addToTracker,
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
