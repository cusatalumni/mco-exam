

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { googleSheetsService } from '../services/googleSheetsService';
import type { Organization, RecommendedBook, ExamProduct } from '../types';
import toast from 'react-hot-toast';

interface AppContextType {
  organizations: Organization[];
  activeOrg: Organization | null;
  isLoading: boolean;
  isInitializing: boolean;
  suggestedBooks: RecommendedBook[];
  examProducts: ExamProduct[];
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
  const [examProducts, setExamProducts] = useState<ExamProduct[]>([]);

  useEffect(() => {
    const fetchExamProducts = async () => {
        try {
          const response = await fetch('https://www.coding-online.net/wp-json/exam-app/v1/products');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setExamProducts(data);
        } catch (error) {
          console.error("Could not load exam products from WordPress:", error);
          toast.error("Could not load exam products list.");
        }
      };

    const initializeApp = async () => {
      setIsInitializing(true);
      
      try {
        await googleSheetsService.initializeAndCategorizeExams();
        toast.success("Exams loaded successfully!", { duration: 2000 });
      } catch (error) {
        console.error("Failed to initialize exams:", error);
        toast.error("Failed to load exams.");
      }

      fetchExamProducts();

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
    <AppContext.Provider value={{ organizations, activeOrg, isLoading, isInitializing, suggestedBooks, examProducts, setActiveOrgById, updateActiveOrg }}>
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