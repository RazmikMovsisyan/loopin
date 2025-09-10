import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { fetchDrafts } from "../api/axiosDrafts";

const DraftsContext = createContext();
export const useDrafts = () => useContext(DraftsContext);

export const DraftsProvider = ({ children }) => {
  const [drafts, setDrafts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();

  const refreshDrafts = useCallback(async () => {
    if (currentUser) {
      try {
        const data = await fetchDrafts();
        setDrafts(data);
        setHasLoaded(true);
      } catch (err) {
        console.error("Error fetching drafts:", err);
        setHasLoaded(true);
      }
    } else {
      setDrafts({ results: [] });
      setHasLoaded(true);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshDrafts();
  }, [refreshDrafts]);

  return (
    <DraftsContext.Provider value={{ 
      drafts, 
      setDrafts, 
      hasLoaded, 
      refreshDrafts 
    }}>
      {children}
    </DraftsContext.Provider>
  );
};