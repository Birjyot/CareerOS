'use client';

import React, { createContext, useContext, useState } from 'react';

type UserData = { name: string; email: string; image?: string } | null;

interface ImpersonationContextType {
  impersonatedUser: UserData;
  setImpersonatedUser: (user: UserData) => void;
}

const ImpersonationContext = createContext<ImpersonationContextType>({
  impersonatedUser: null,
  setImpersonatedUser: () => {},
});

export function ImpersonationProvider({ children }: { children: React.ReactNode }) {
  const [impersonatedUser, setImpersonatedUser] = useState<UserData>(null);

  return (
    <ImpersonationContext.Provider value={{ impersonatedUser, setImpersonatedUser }}>
      {children}
    </ImpersonationContext.Provider>
  );
}

export function useImpersonation() {
  return useContext(ImpersonationContext);
}
