import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowRightToBracket,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import TranslationWrapper from "./TranslationWrapper";

const HomePage: React.FC = () => {
  const [name, setName] = useState("");
  const [chatroomId, setChatroomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const { language, content } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatroomIdFromURL = params.get("chatroomId");
    if (chatroomIdFromURL) {
      setChatroomId(chatroomIdFromURL);
      setIsJoining(true);
    }
  }, [location]);

  const createChatroom = () => {
    const newChatroomId = Math.random().toString(36).substring(2, 7);
    const chatroomUrl = `/chatroom/${newChatroomId}?name=${encodeURIComponent(
      name
    )}&language=${encodeURIComponent(language)}`;
    navigate(chatroomUrl);
    window.location.reload();
  };

  const joinChatroom = () => {
    if (chatroomId) {
      const chatroomUrl = `/chatroom/${chatroomId}?name=${encodeURIComponent(
        name
      )}&language=${encodeURIComponent(language)}`;
      navigate(chatroomUrl);
      window.location.reload();
    }
  };

  return (
    <div className="homepage-content">
      <div>
        <label>About this app...</label>
        <h1>
          <span>T</span>-Chat
        </h1>
        <p>
          <TranslationWrapper targetLanguage={language} sourceLanguage="en">
            "T" is for "Translation". Chat with
            anyone anywhere without any language barriers. Enter your name and
            then either create a chatroom or join one using the Chatroom ID. Be
            safe, and have fun!
          </TranslationWrapper>
        </p>
      </div>
      <div>
        <label>Enter your name</label>
        <input
          className="name-input"
          type="text"
          placeholder={content['placeholder-name']}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="main-buttons-container">
        <button
          data-tooltip={content['tooltip-create']}
          className={`tooltip bottom-right ${name === "" ? "disabled" : ""}`}
          onClick={createChatroom}
          disabled={name === ""}
        >
          <FontAwesomeIcon icon={faPlus} /> 
          <TranslationWrapper targetLanguage={language} sourceLanguage="en">
            {content['create-chatroom']}
          </TranslationWrapper>
        </button>
        <span>
          <TranslationWrapper targetLanguage={language} sourceLanguage="en">
            - OR -
          </TranslationWrapper>
        </span>
        <button
          className={`tooltip join-chatroom-button bottom-right ${
            name === "" ? "disabled" : ""
          }`}
          onClick={() => setIsJoining(true)}
          disabled={name === ""}
        >
          <FontAwesomeIcon icon={faArrowRightToBracket} /> 
          <TranslationWrapper targetLanguage={language} sourceLanguage="en">
            {content['join-chatroom']}
          </TranslationWrapper>
        </button>
      </div>

      {isJoining && (
        <div className="home-bottom-content">
          <div className="or-container">
            <hr />
            <span>
              <TranslationWrapper targetLanguage={language} sourceLanguage="en">
                Enter Chatroom ID
              </TranslationWrapper>
            </span>
            <hr />
          </div>

          <div className="chatroom-id-input-container">
            <input
              className="chatroom-id-input"
              type="text"
              placeholder={content['placeholder-chatroom-id']}
              value={chatroomId}
              onChange={(e) => setChatroomId(e.target.value)}
            />
            <button
              className={`continue-button success ${
                name === "" || chatroomId === "" ? "disabled" : ""
              }`}
              onClick={joinChatroom}
              disabled={chatroomId === ""}
            >
              <TranslationWrapper targetLanguage={language} sourceLanguage="en">
                Continue
              </TranslationWrapper>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
