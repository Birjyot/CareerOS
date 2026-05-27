'use client';

import { SessionProvider } from "next-auth/react";
import { ImpersonationProvider } from "./ImpersonationContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ImpersonationProvider>
                {children}
            </ImpersonationProvider>
        </SessionProvider>
    );
}
