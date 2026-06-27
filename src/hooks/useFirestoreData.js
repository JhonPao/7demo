import { useState, useEffect } from 'react';
import { subscribeAllData } from '../data/firestoreService';

export function useFirestoreData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAllData(result => {
      setData(result);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}
