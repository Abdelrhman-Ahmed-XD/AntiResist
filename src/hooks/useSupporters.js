import { useEffect, useState } from "react";
import { getSupporters } from "../firebase/firestore";

export function useSupporters() {
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getSupporters()
      .then((data) => { if (mounted) setSupporters(data); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { supporters, loading };
}
