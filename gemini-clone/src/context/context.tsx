import { createContext, useCallback, useEffect, useState } from "react";
import { callGeminiApiWithFetch } from "../config/gemini";

export const GeminiContext: any = createContext({});

const ContextProvider = (props: any) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompts, setPreviousPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const onSent = useCallback(async (prompt: string) => {
    const result = await callGeminiApiWithFetch(prompt);
    console.log("result>>", result);
  }, []);

  const contextValue = {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    previousPrompts,
    setPreviousPrompts,
    showResult,
    setShowResult,
    resultData,
    setResultData,
    onSent,
  };

  return (
    <GeminiContext.Provider value={contextValue}>
      {props.children}
    </GeminiContext.Provider>
  );
};

export default ContextProvider;
