import { createContext, useCallback, useEffect, useState } from "react";
import { callGeminiApiWithFetch } from "../config/gemini";

export const GeminiContext: any = createContext({});

const ContextProvider = (props: any) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompts, setPreviousPrompts] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = useCallback((index: any, nextWord: string) => {
    setTimeout(() => {
      setResultData((prev: any) => prev + nextWord);
    }, 75 * index);
  }, []);
  const onSent = useCallback(async (prompt: string, isPrevPrompt = false) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(prompt);
    !isPrevPrompt && setPreviousPrompts((prev) => [...prev, prompt]);
    const result = await callGeminiApiWithFetch(prompt);
    let resultArray = result.split("**");

    let newArray: string = "";
    for (let i = 0; i < resultArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newArray += resultArray[i];
      } else {
        newArray += "<b>" + resultArray[i] + "</b>";
      }
    }
    let rewResponse = newArray?.split("*").join("</br>");

    let newResponseArray = rewResponse.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      delayPara(i, newResponseArray[i] + "  ");
    }
    setLoading(false);
    setInput("");
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
    loading,
  };

  return (
    <GeminiContext.Provider value={contextValue}>
      {props.children}
    </GeminiContext.Provider>
  );
};

export default ContextProvider;
