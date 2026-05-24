import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserProfile, updateUserProfile } from '../firebase/firestore';

const HCPScoreContext = createContext(null);

export function HCPScoreProvider({ children }) {
  const [state, setState] = useState({ score: 0, completed: false });
  const uidRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        uidRef.current = firebaseUser.uid;
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile?.hcpScore) {
            setState({ score: profile.hcpScore, completed: true });
          }
        } catch {}
      } else {
        uidRef.current = null;
        setState({ score: 0, completed: false });
      }
    });
    return unsub;
  }, []);

  function setScore(score) {
    setState({ score, completed: true });
    if (uidRef.current) {
      updateUserProfile(uidRef.current, { hcpScore: score }).catch(() => {});
    }
  }

  return (
    <HCPScoreContext.Provider value={{ ...state, setScore }}>
      {children}
    </HCPScoreContext.Provider>
  );
}

export function useHCPScore() {
  return useContext(HCPScoreContext);
}
