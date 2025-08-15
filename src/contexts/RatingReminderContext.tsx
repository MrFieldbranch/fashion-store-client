import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import apiService from "../services/api-service";
import type { RatingReminderResponse } from "../models/RatingReminderResponse";

interface RatingReminderContextType {  
  ratingReminders: RatingReminderResponse[]
  refreshRatingReminders: () => void;
}

const RatingReminderContext = createContext<RatingReminderContextType | undefined>(undefined);

export const useRatingReminder = (): RatingReminderContextType => {
  const context = useContext(RatingReminderContext);
  if (!context) {
    throw new Error("useRatingReminder måste användas inom en RatingReminderProvider.");
  }
  return context;
};

export const RatingReminderProvider = ({ children }: { children: ReactNode }) => {
  const { loggedInUserId } = useAuth();  
  const [ratingReminders, setRatingReminders] = useState<RatingReminderResponse[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchRatingReminders = async () => {
      try {
        if (!loggedInUserId) {
          setRatingReminders([]);          
          return;
        }
        const response = await apiService.getRatingRemindersAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setRatingReminders(response);          
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setRatingReminders([]);          
        }
      }
    };

    fetchRatingReminders();
    return () => abortCont.abort();
  }, [loggedInUserId, refreshTrigger]);

  const refreshRatingReminders = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <RatingReminderContext.Provider value={{ ratingReminders, refreshRatingReminders }}>
      {children}
    </RatingReminderContext.Provider>
  );
};
