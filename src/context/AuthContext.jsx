import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkedUid = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Skip Firestore on token refreshes for the same user
        if (firebaseUser.uid !== checkedUid.current) {
          checkedUid.current = firebaseUser.uid;
          try {
            // Race against a 4-second timeout in case Firestore rules block the read
            const snap = await Promise.race([
              getDoc(doc(db, "admins", firebaseUser.uid)),
              new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 4000)),
            ]);
            setIsAdmin(snap.exists());
          } catch {
            setIsAdmin(false);
          }
        }
      } else {
        checkedUid.current = null;
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshUser = useCallback(() => {
    const u = auth.currentUser;
    if (!u) return;
    // Object.create preserves the Firebase User prototype (keeps getIdToken, reload, etc.)
    // Object.assign copies all own properties (uid, photoURL, displayName, stsTokenManager…)
    // Result: a new reference React sees as changed, but still a real Firebase User-like object
    const fresh = Object.create(Object.getPrototypeOf(u));
    Object.assign(fresh, u);
    setUser(fresh);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
