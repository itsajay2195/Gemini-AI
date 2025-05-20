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

  const delayPara = useCallback((index: any) => {}, []);
  const onSent = useCallback(async (prompt: string) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(prompt);
    const result = await callGeminiApiWithFetch(prompt);
    let resultArray = result.split("**");
    console.log("resultArray>>>", resultArray);
    let newArray: string = "";
    for (let i = 0; i < resultArray.lengthl; i++) {
      if (i === 0 || i % 2 !== 1) {
        newArray += resultArray[i];
      } else {
        newArray += "<b>" + resultArray[i] + "</b>";
      }
    }
    setResultData(newArray);
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
