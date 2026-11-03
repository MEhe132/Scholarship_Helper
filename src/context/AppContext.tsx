'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, ApplicationCard, DocumentItem, Authority, DuplicateNotice, ApplicationStatus, AuthUser } from '../lib/types';
import { authoritiesData } from '../data/authoritiesData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface AppContextType {
  currentUser: AuthUser | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  loginWithGoogle: () => Promise<void>;
  loginWithPassword: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithPassword: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

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

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      });
      if (error) {
        throw error;
      }
      return;
    }

    // Demo Mode Google Login Simulation
    const demoGoogleUser: AuthUser = {
      id: `google-${Date.now()}`,
      email: 'mhbhuiyan132@gmail.com',
      fullName: 'Mehedi Hasan',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      provider: 'google',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(demoGoogleUser);
    localStorage.setItem('gsh_auth_user', JSON.stringify(demoGoogleUser));

    // Also update profile name if default
    updateProfile({ fullName: demoGoogleUser.fullName });
  };

  const loginWithPassword = async (identifier: string, password: string) => {
    if (!identifier || !password) {
      return { success: false, error: 'Please enter both User ID/Email and password.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const authedUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || identifier,
          fullName: data.user.user_metadata?.full_name || identifier.split('@')[0],
          provider: 'email',
          createdAt: data.user.created_at,
        };
        setCurrentUser(authedUser);
        localStorage.setItem('gsh_auth_user', JSON.stringify(authedUser));
      }
      return { success: true };
    }

    // Demo Mode Password Login Simulation
    const namePart = identifier.includes('@') ? identifier.split('@')[0] : identifier;
    const demoUser: AuthUser = {
      id: `user-${Date.now()}`,
      email: identifier.includes('@') ? identifier : `${identifier}@student.university.edu`,
      fullName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(demoUser);
    localStorage.setItem('gsh_auth_user', JSON.stringify(demoUser));
    updateProfile({ fullName: demoUser.fullName });

    return { success: true };
  };

  const registerWithPassword = async (email: string, password: string, fullName: string) => {
    if (!email || !password || !fullName) {
      return { success: false, error: 'All fields are required for sign up.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const authedUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: fullName,
          provider: 'email',
          createdAt: data.user.created_at,
        };
        setCurrentUser(authedUser);
        localStorage.setItem('gsh_auth_user', JSON.stringify(authedUser));
      }
      return { success: true };
    }

    // Demo Mode Registration
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    localStorage.setItem('gsh_auth_user', JSON.stringify(newUser));
    updateProfile({ fullName });

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
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        loginWithGoogle,
        loginWithPassword,
        registerWithPassword,
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
