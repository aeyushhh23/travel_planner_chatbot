document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const floatingChatButton = document.getElementById('floating-chat-button');
    const minimizeChat = document.getElementById('minimize-chat');
    const chatContainer = document.querySelector('.chat-container');
    const suggestedQuestions = document.querySelectorAll('.suggested-question');
  
    // State
    let isChatOpen = true;
  
    // Constants
    const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAM6XOKLo-xyIEG4C219nYUPkaWpTOT9Ak`;
  
    // Mobile Menu Toggle
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  
    // Chat Functions
    const addMessage = (content, isUser = false) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${isUser ? 'user' : 'ai'} fade-in`;
      messageDiv.innerHTML = `<div class="p-3">${formatResponse(content)}</div>`;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };
  
    const formatResponse = (text) => {
      // Convert markdown-style formatting to HTML
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
        .replace(/^-\s(.*$)/gm, '<li>$1</li>') // List items
        .replace(/\n/g, '<br>') // Line breaks
        .replace(/<li>.*<\/li>/g, (match) => `<ul>${match}</ul>`); // Wrap lists
    };
  
    const showTyping = () => {
      typingIndicator.classList.remove('hidden');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };
  
    const hideTyping = () => typingIndicator.classList.add('hidden');
  
    const sendToGemini = async (message) => {
      showTyping();
      try {
        const response = await fetch(GEMINI_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `As a travel expert, provide concise recommendations about: ${message}. 
                Format response with:
                - Bold headings (**Heading**)
                - Bullet points for lists (- Item)
                - Keep responses under 300 words
                - Focus on key information
                - Use simple formatting`
              }]
            }]
          })
        });
        const data = await response.json();
        hideTyping();
        data.candidates?.[0]?.content?.parts?.[0]?.text 
          ? addMessage(data.candidates[0].content.parts[0].text)
          : addMessage("I'm having trouble responding. Please try again.");
      } catch (error) {
        hideTyping();
        addMessage("Technical difficulties. Please try later.");
        console.error('API Error:', error);
      }
    };
  
    // Event Handlers
    const handleSend = () => {
      const message = userInput.value.trim();
      if (message) {
        addMessage(message, true);
        userInput.value = '';
        sendToGemini(message);
      }
    };
  
    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleSend());
  
    suggestedQuestions.forEach(btn => {
      btn.addEventListener('click', () => {
        userInput.value = btn.textContent.trim();
        userInput.focus();
      });
    });
  
    floatingChatButton.addEventListener('click', () => {
      if (!isChatOpen) {
        document.getElementById('chatbot').scrollIntoView({ behavior: 'smooth' });
        chatContainer.classList.remove('hidden');
        isChatOpen = true;
      } else {
        document.getElementById('chatbot').scrollIntoView({ behavior: 'smooth' });
      }
    });
  
    minimizeChat.addEventListener('click', () => {
      chatContainer.classList.add('hidden');
      isChatOpen = false;
    });
  
    // Initial Focus
    userInput.focus();
  });