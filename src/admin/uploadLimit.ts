import { useEffect, useState } from 'react';
import { api } from '../lib/api';

let limitsPromise: Promise<{ maxMb: number }> | null = null;
/** Upload size limit from the server: 4 MB on Vercel (Blob), 15 MB on a local computer. */
export function useUploadLimit() {
  const [mb, setMb] = useState<number | null>(null);
  useEffect(() => {
    limitsPromise ??= api.get<{ maxMb: number }>('/upload/limits').catch(() => ({ maxMb: 4 }));
    limitsPromise.then((l) => setMb(l.maxMb));
  }, []);
  return mb;
}
