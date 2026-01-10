import React, { createContext, useState, useEffect, useMemo } from "react";
import { LS_KEY } from "../data/constants";

export interface QuizContextType {
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const QuizContext = createContext<QuizContextType | undefined>(
  undefined
);

export function QuizContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(
    () => {
      const storedIndex = localStorage.getItem(LS_KEY);
      return storedIndex !== null ? Number(storedIndex) : 0;
    }
  );

  useEffect(() => {
    localStorage.setItem(LS_KEY, String(currentQuestionIndex));
  }, [currentQuestionIndex]);

  const contextValue = useMemo(
    () => ({
      currentQuestionIndex,
      setCurrentQuestionIndex,
    }),
    [currentQuestionIndex]
  );

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  );
}
