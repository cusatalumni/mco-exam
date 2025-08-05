

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { googleSheetsService } from '../services/googleSheetsService';
import type { Organization, RecommendedBook } from '../types';
import toast from 'react-hot-toast';

interface AppContextType {
  organizations: Organization[];
  activeOrg: Organization | null;
  isLoading: boolean;
  isInitializing: boolean;
  suggestedBooks: RecommendedBook[];
  setActiveOrgById: (orgId: string) => void;
  updateActiveOrg: (updatedOrg: Organization) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [suggestedBooks, setSuggestedBooks] = useState<RecommendedBook[]>([]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await googleSheetsService.initializeAndCategorizeExams();
        toast.success("Exams loaded successfully!", { duration: 2000 });
      } catch (error) {
        console.error("Failed to initialize exams:", error);
        toast.error("Failed to load exams.");
      }

      const allOrgs = googleSheetsService.getOrganizations();
      setOrganizations(allOrgs);
      if (allOrgs.length > 0) {
          const org = allOrgs[0];
          setActiveOrg(org);
          
          if (org.masterBookList && org.masterBookList.length > 0) {
              const shuffled = [...org.masterBookList].sort(() => 0.5 - Math.random());
              setSuggestedBooks(shuffled.slice(0, 3));
          }
      }
      setIsInitializing(false);
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const setActiveOrgById = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
        setActiveOrg(org);
    }
  };

  const updateActiveOrg = (updatedOrg: Organization) => {
    setOrganizations(prevOrgs => 
        prevOrgs.map(org => org.id === updatedOrg.id ? updatedOrg : org)
    );
    setActiveOrg(updatedOrg);
  };

  return (
    <AppContext.Provider value={{ organizations, activeOrg, isLoading, isInitializing, suggestedBooks, setActiveOrgById, updateActiveOrg }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};