import { createContext, useContext, useState } from 'react';

const HCPScoreContext = createContext(null);

export function HCPScoreProvider({ children }) {
  const [state, setState] = useState({ score: 0, completed: false });

  function setScore(score) {
    setState({ score, completed: true });
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
