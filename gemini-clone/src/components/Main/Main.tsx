import { useContext } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { GeminiContext } from "../../context/context";

const Main = () => {
  const {
    input,
    setInput,
    onSent,
    recentPrompt,
    showResult,
    resultData,
    loading,
  }: any = useContext(GeminiContext);

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img className="menu" src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, User</span>
                <p>How can I help you today?</p>
              </p>
            </div>

            <div className="cards">
              <div className="card">
                <p>Suggest some beautiful places</p>
                <img className="menu" src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>what is the weather in Chennai today?</p>
                <img className="menu" src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>What is the op trading strategy today?</p>
                <img className="menu" src={assets.message_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon}></img>
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon}></img>
              {loading ? (
                <div className="loader">
                  <hr></hr>
                  <hr></hr>
                  <hr></hr>
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e?.target?.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              {/* <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" /> */}
              {input?.length > 0 && (
                <img
                  onClick={() => onSent(input)}
                  src={assets.send_icon}
                  alt=""
                />
              )}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Gemini Apps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
