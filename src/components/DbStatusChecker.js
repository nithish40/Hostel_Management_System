// src/components/DbStatusChecker.js
'use client';

import { useState, useEffect } from 'react';

export default function DbStatusChecker() {
  const [status, setStatus] = useState({ checking: true });
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/db-status');
        const data = await response.json();
        setStatus({ ...data, checking: false });
      } catch (err) {
        setError('Failed to check database status');
        setStatus({ checking: false });
      }
    };

    checkStatus();
  }, []);

  if (status.checking) {
    return <div className="text-gray-500">Checking database connection...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className={`p-2 rounded-md ${status.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      Database: {status.status}
      {status.error && <div className="text-xs mt-1">{status.error}</div>}
    </div>
  );
}
