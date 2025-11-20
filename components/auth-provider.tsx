'use client';

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const profileRef = doc(firestore, 'users', authUser.uid);
        const snapshot = await getDoc(profileRef);
        if (snapshot.exists()) {
          setProfile(snapshot.data() as UserProfile);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const requiresLogin = pathname !== '/login';
    const requiresOnboarding = pathname !== '/onboarding' && pathname !== '/login';
    const hasTasks = profile && Object.keys(profile.customTasks ?? {}).length > 0;

    if (!user && requiresLogin) {
      router.push('/login');
      return;
    }

    if (user && profile && !hasTasks && requiresOnboarding) {
      router.push('/onboarding');
    }
  }, [user, profile, loading, pathname, router]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signOutUser: () => signOut(firebaseAuth),
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
