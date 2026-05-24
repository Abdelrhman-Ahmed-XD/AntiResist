import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserProfile, updateUserProfile } from '../firebase/firestore';

const Ctx = createContext(null);

export const BADGES = [
  {
    id: 'beginner',
    label: 'Awareness Beginner',
    emoji: '🥉',
    required: 10,
    desc: 'You took your first step toward AMR awareness.',
    color: 'from-amber-700 to-amber-500',
  },
  {
    id: 'fighter',
    label: 'Resistance Fighter',
    emoji: '🥈',
    required: 30,
    desc: 'You are actively learning to fight antibiotic resistance.',
    color: 'from-slate-500 to-slate-300',
  },
  {
    id: 'supporter',
    label: 'Stewardship Supporter',
    emoji: '🥇',
    required: 60,
    desc: 'You are committed to responsible antibiotic stewardship.',
    color: 'from-yellow-600 to-yellow-400',
  },
];

export function GamificationProvider({ children }) {
  const [uid, setUid]           = useState(null);
  const [state, setState]       = useState({ points: 0, done: new Set() });
  const [userName, setUserName] = useState('');

  // Ref keeps uid accessible inside addPoints without stale closures
  const uidRef = useRef(null);
  useEffect(() => { uidRef.current = uid; }, [uid]);

  // Pending Firestore write — set by addPoints, flushed by the effect below.
  // Using a ref (not state) avoids triggering extra renders.
  const pendingRef = useRef(null);

  // ── Load profile from Firestore when user signs in ───────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Discard any stale guest-session pending writes before loading real data
        pendingRef.current = null;
        setUid(firebaseUser.uid);
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setState({
              points: profile.points        ?? 0,
              done:   new Set(profile.completedActions ?? []),
            });
            if (profile.name) setUserName(profile.name);
          }
        } catch (err) {
          console.error('[Gamification] failed to load profile:', err);
        }
      } else {
        pendingRef.current = null;
        setUid(null);
        setState({ points: 0, done: new Set() });
        setUserName('');
      }
    });
    return unsub;
  }, []);

  // ── Flush pending write to Firestore after state settles ─────────────────
  useEffect(() => {
    if (!pendingRef.current || !uidRef.current) return;
    const payload = pendingRef.current;
    pendingRef.current = null;
    updateUserProfile(uidRef.current, payload).catch((err) =>
      console.error('[Gamification] failed to save points:', err)
    );
  }, [state]); // runs after every state update — only writes when pendingRef is set

  // ── Add points (deduped by actionId) ────────────────────────────────────
  const addPoints = useCallback((actionId, pts) => {
    setState(prev => {
      if (prev.done.has(actionId)) return prev; // already earned, no change
      const newDone   = new Set([...prev.done, actionId]);
      const newPoints = prev.points + pts;
      const earnedBadgeIds = BADGES
        .filter(b => newPoints >= b.required)
        .map(b => b.id);

      // Queue the Firestore write (safe: refs are mutable, no React tracking)
      pendingRef.current = {
        points:           newPoints,
        completedActions: [...newDone],
        badges:           earnedBadgeIds,
      };

      return { points: newPoints, done: newDone };
    });
  }, []);

  const hasAction = useCallback((id) => state.done.has(id), [state.done]);

  const { points } = state;
  const unlockedBadges = BADGES.filter(b => points >= b.required);
  const hasGoldBadge   = points >= 60;
  const nextBadge      = BADGES.find(b => points < b.required) ?? null;

  return (
    <Ctx.Provider value={{
      points,
      addPoints,
      hasAction,
      badges: BADGES,
      unlockedBadges,
      hasGoldBadge,
      nextBadge,
      userName,
      setUserName,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useGamification = () => useContext(Ctx);
