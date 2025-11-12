import { createContext, ReactNode, useContext, useState } from "react";

type AuthContextType = {
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  userName: string | null;
  setUserName: (name: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ userEmail, setUserEmail, userName, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
