"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SubmitterContextType {
  token: string | null;
  name: string;
  setName: (name: string) => void;
  isLoaded: boolean;
}

const SubmitterContext = createContext<SubmitterContextType | null>(null);

export function SubmitterProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [name, setNameState] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize or retrieve token from localStorage
    let storedToken = localStorage.getItem("submitter_token");
    if (!storedToken) {
      storedToken = crypto.randomUUID();
      localStorage.setItem("submitter_token", storedToken);
    }
    setToken(storedToken);

    // Retrieve saved name if any (per D-09: remember name in browser)
    const storedName = localStorage.getItem("submitter_name") || "";
    setNameState(storedName);

    setIsLoaded(true);
  }, []);

  const setName = (newName: string) => {
    setNameState(newName);
    localStorage.setItem("submitter_name", newName);
  };

  return (
    <SubmitterContext.Provider value={{ token, name, setName, isLoaded }}>
      {children}
    </SubmitterContext.Provider>
  );
}

export function useSubmitter() {
  const context = useContext(SubmitterContext);
  if (!context) {
    throw new Error("useSubmitter must be used within a SubmitterProvider");
  }
  return context;
}
