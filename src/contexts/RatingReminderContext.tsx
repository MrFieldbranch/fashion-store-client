import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import apiService from "../services/api-service";

interface RatingReminderContextType {
  totalUnansweredReminders: number;
  refreshRatingReminderNumber: () => void;
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
  const [totalUnansweredReminders, setTotalUnansweredReminders] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchRatingReminders = async () => {
      try {
        if (!loggedInUserId) {
          setTotalUnansweredReminders(0);
          return;
        }
        const response = await apiService.getRatingRemindersAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setTotalUnansweredReminders(response.length);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setTotalUnansweredReminders(0);
        }
      }
    };

    fetchRatingReminders();
    return () => abortCont.abort();
  }, [loggedInUserId, refreshTrigger]);

  const refreshRatingReminderNumber = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <RatingReminderContext.Provider value={{ totalUnansweredReminders, refreshRatingReminderNumber }}>
      {children}
    </RatingReminderContext.Provider>
  );
};
