import React, { useState, useEffect, useRef } from "react";
import { useTheme } from '@mui/material/styles';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import './AboutMe.css';

function AboutMe() {
  const theme = useTheme();
  const [hovered, setHovered] = useState(null);
  const sectionRef = useRef(null);

  return (
    <div 
      ref={sectionRef} 
      className="about-me" 
      style={{ background: theme.palette.background.default, color: theme.palette.text.primary }}
    >
      <h1>About Me</h1>
      <p>
        Computers are kewl.
      </p>

      <div className="social-links">
        <a 
          href="https://github.com/Bishwasz" 
          target="_blank" 
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered("github")}
          onMouseLeave={() => setHovered(null)}
        >
          <FaGithub size={32} color={hovered === "github" ? "#6e5494" : theme.palette.text.primary} />
        </a>
        
        <a 
          href="https://www.linkedin.com/in/bishwas-bhattarai/" 
          target="_blank" 
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered("linkedin")}
          onMouseLeave={() => setHovered(null)}
        >
          <FaLinkedin size={32} color={hovered === "linkedin" ? "#0077b5" : theme.palette.text.primary} />
        </a>
      </div>
    </div>
  );
}

export default AboutMe;

// function AboutMe() {
//   const theme = useTheme();
//   const [message, setMessage] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [ws, setWs] = useState(null); // Store WebSocket instance
//   const [isConnected, setIsConnected] = useState(false); // Connection status

//   const chatEndRef = useRef(null); // Reference to the bottom of the chat

//   // Auto-scroll when chatHistory changes
//   useEffect(() => {
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [chatHistory]);

//   // Initialize WebSocket connection when component mounts
//   useEffect(() => {
//     const websocketUrl = 'ws://192.168.1.119:8000/chat';
//     const websocket = new WebSocket(websocketUrl);

//     websocket.onopen = () => {
//       console.log('WebSocket connected');
//       setIsConnected(true);
//       setIsLoading(false);
//       setChatHistory((prev) => [
//         ...prev,
//         { type: 'system', text: 'Connected to the LLM server.' }
//       ]);
//     };

//     websocket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setChatHistory((prev) => [
//         ...prev,
//         { type: 'bot', text: data.response || 'Error: No response from server' }
//       ]);
//       setIsLoading(false);
//     };

//     websocket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//       setIsConnected(false);
//       setChatHistory((prev) => [
//         ...prev,
//         { type: 'system', text: 'Error: Could not connect to the chat server.' }
//       ]);
//       setIsLoading(false);
//     };

//     websocket.onclose = () => {
//       console.log('WebSocket disconnected');
//       setIsConnected(false);
//       setIsLoading(false);
//       setChatHistory((prev) => [
//         ...prev,
//         { type: 'system', text: 'Disconnected from the LLM server. Attempting to reconnect...' }
//       ]);
//       setTimeout(() => {
//         console.log('Attempting to reconnect...');
//       }, 5000);
//     };

//     setWs(websocket);

//     return () => {
//       websocket.close();
//     };
//   }, []);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!message.trim() || !ws || ws.readyState !== WebSocket.OPEN) {
//       console.log('Cannot send message: WebSocket not open or message is empty.');
//       return;
//     }

//     setIsLoading(true);
//     setChatHistory((prev) => [...prev, { type: 'user', text: message }]);
//     ws.send(JSON.stringify({ q: message }));
//     setMessage('');
//   };

//   return (
//     <div className="AboutMePage" style={{ color: theme.palette.text.primary }}>
//       <h1 style={{ color: theme.palette.text.primary }}>About</h1>
//       <div className="DescriptionMe">
//         <p>
//           In short... I like computers.<br />
//           This is an experimental, LoRA-fine-tuned LLM designed to communicate on my behalf. It's a compact 135-million parameter model, currently running on a Raspberry Pi 5. Due to its size and hardware, it's prone to hallucinations and has noticeable response delays. Nevertheless, I encourage you to ask it questions about me and see if it can provide insightful answers. I anticipate that as technology evolves, this model will improve in both its accuracy and speed.
//         </p>
//       </div>

//       <div className="ChatBox">
//         <div className="ChatHistory">
//           {chatHistory.map((entry, index) => (
//             <div key={index} className={`ChatMessage ${entry.type}`}>
//               <span>{entry.text}</span>
//             </div>
//           ))}
//           <div ref={chatEndRef} />
//         </div>

//         <form onSubmit={handleSendMessage} className="ChatInputForm">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Ask about me..."
//             disabled={isLoading || !ws || ws.readyState !== WebSocket.OPEN}
//             className="ChatInput"
//           />
//           <button
//             type="submit"
//             disabled={isLoading || !ws || ws.readyState !== WebSocket.OPEN}
//             className="ChatButton"
//           >
//             {isLoading ? 'Sending...' : 'Send'}
//           </button>
//         </form>
//       </div>

//       <div className="Links">
//         <a href="https://github.com/bishwasz" target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.text.primary }}>
//           <FaGithub />
//         </a>
//         <a href="https://www.linkedin.com/in/bishwas-bhattarai-269938219/" target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.text.primary }}>
//           <FaLinkedin />
//         </a>
//       </div>
//     </div>
//   );
// }

// export default AboutMe;
