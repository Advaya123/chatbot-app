import React, { useState } from "react";
import Header from "./Header";
import MainComponent from "./MainComponent";
import "./theme.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 **Hello!** How can I help you today?" },
  ]);

  // Reset chat
  const handleClearChat = () => {
    setMessages([
      { role: "assistant", content: "👋 **Hello!** How can I help you today?" },
    ]);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onClearChat={handleClearChat}
      />
      <MainComponent
        darkMode={darkMode}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}

export default App;
