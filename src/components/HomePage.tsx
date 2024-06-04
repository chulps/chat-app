import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowRightToBracket, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import TranslationWrapper from "./TranslationWrapper";

const HomePage: React.FC = () => {
  const [name, setName] = useState("");
  const [chatroomId, setChatroomId] = useState("");
  const [isChatroomIdValid, setIsChatroomIdValid] = useState(false);
  const [isJoiningChatroom, setIsJoiningChatroom] = useState(false);
  const { language, content } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatroomIdFromUrl = params.get("chatroomId");
    if (chatroomIdFromUrl) {
      setChatroomId(chatroomIdFromUrl);
      setIsJoiningChatroom(true);
    }
  }, [location]);

  useEffect(() => {
    const isValidChatroomId = /^[a-zA-Z0-9]{5}$/.test(chatroomId);
    setIsChatroomIdValid(isValidChatroomId);
  }, [chatroomId]);

  const createChatroom = () => {
    const newChatroomId = Math.random().toString(36).substring(2, 7);
    const chatroomUrl = `/chatroom/${newChatroomId}?name=${encodeURIComponent(
      name
    )}&language=${encodeURIComponent(language)}`;
    navigate(chatroomUrl);
    window.location.reload(); // Force reload to establish socket connection
  };

  const joinChatroom = () => {
    if (isChatroomIdValid) {
      const chatroomUrl = `/chatroom/${chatroomId}?name=${encodeURIComponent(
        name
      )}&language=${encodeURIComponent(language)}`;
      navigate(chatroomUrl);
      window.location.reload(); // Force reload to establish socket connection
    } else {
      alert("Please enter a valid Chatroom ID.");
    }
  };

  return (
    <div className="homepage-content">
      <div>
        <label>
          <TranslationWrapper targetLanguage={language}>
            About this app...
          </TranslationWrapper>
        </label>
        <h1>
          <span>T</span>-Chat
        </h1>
        <p>
          <TranslationWrapper targetLanguage={language}>
            "T" is for 
            </TranslationWrapper>
            <span className="italic">
              <TranslationWrapper targetLanguage={language}>
                "Translation"
              </TranslationWrapper>
            </span>
            
            <TranslationWrapper targetLanguage={language}>
            . Chat with
            anyone anywhere without any language barriers. Enter your name and
            then either create a chatroom or join one using the Chatroom ID. Be
            safe, and have fun!
          </TranslationWrapper>
        </p>
      </div>
      <div>
        <TranslationWrapper targetLanguage={language}>
        <label>{content['placeholder-name']}</label>
        </TranslationWrapper>
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
          className={`tooltip bottom-right ${name === "" || chatroomId !== "" ? "disabled" : ""}`}
          onClick={createChatroom}
        >
          <FontAwesomeIcon icon={faPlus} /> 
          <TranslationWrapper targetLanguage={language}>
            Create
          </TranslationWrapper>
        </button>
        <span>
          <TranslationWrapper targetLanguage={language}>
            - OR -
          </TranslationWrapper>
        </span>
        <button
          data-tooltip={content['tooltip-join']}
          className={`tooltip join-chatroom-button bottom-left ${
            name === "" ? "disabled" : ""
          }`}
          onClick={() => setIsJoiningChatroom(true)}
          disabled={name === ""}
        >
          <TranslationWrapper targetLanguage={language}>
            Join
          </TranslationWrapper>
          <FontAwesomeIcon icon={faArrowRightToBracket} /> 
        </button>
      </div>

      {isJoiningChatroom && (
        <div className="home-bottom-content">
          <div className="or-container">
            <hr />
            <span>
              <TranslationWrapper targetLanguage={language}>
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
                name === "" || !isChatroomIdValid ? "disabled" : ""
              }`}
              onClick={joinChatroom}
              disabled={!isChatroomIdValid}
            >
              <TranslationWrapper targetLanguage={language}>
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
