import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
// API service functions for real external searches
const apiServices = {
  async searchGoogle(query) {
    try {
      const response = await fetch(`/api/google-search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch from Google');
      }
      const data = await response.json();
      return data.items?.[0]?.snippet || 'No results found on Google.';
    } catch (error) {
      console.error('Google search error:', error);
      return 'Sorry, I encountered an error when searching Google.';
    }
  },
  
  async searchWikipedia(query) {
    try {
      const response = await fetch(`/api/wikipedia-search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch from Wikipedia');
      }
      const data = await response.json();
      return data.extract || 'No results found on Wikipedia.';
    } catch (error) {
      console.error('Wikipedia search error:', error);
      return 'Sorry, I encountered an error when searching Wikipedia.';
    }
  }
};

const App = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. You can ask me questions, and I can search Google and Wikipedia for information. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchSource, setSearchSource] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle AI responses with real API calls
  const getAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    try {
      // Extract the main query from the user message
      const query = extractQueryFromMessage(userMessage);
      let responseContent = '';
      
      // Check if the message appears to be a search query
      const searchTerms = ['search', 'find', 'look up', 'google', 'wikipedia', 'what is', 'tell me about'];
      const isSearchQuery = searchTerms.some(term => userMessage.toLowerCase().includes(term));
      
      if (isSearchQuery && query) {
        // Determine which source to search in
        if (userMessage.toLowerCase().includes('google')) {
          setSearchSource('google');
          const googleResult = await apiServices.searchGoogle(query);
          responseContent = `Here's what I found on Google about "${query}":\n\n${googleResult}`;
        } else if (userMessage.toLowerCase().includes('wikipedia')) {
          setSearchSource('wikipedia');
          const wikipediaResult = await apiServices.searchWikipedia(query);
          responseContent = `Here's what I found on Wikipedia about "${query}":\n\n${wikipediaResult}`;
        } else {
          // Default to searching both
          setSearchSource('both');
          const [googleResult, wikipediaResult] = await Promise.all([
            apiServices.searchGoogle(query),
            apiServices.searchWikipedia(query)
          ]);
          
          responseContent = `I found information from both Google and Wikipedia about "${query}":\n\n`;
          responseContent += `Google: ${googleResult}\n\n`;
          responseContent += `Wikipedia: ${wikipediaResult}`;
        }
      } else {
        // General conversation responses for non-search queries
        const generalResponses = [
          "I'm an AI assistant that can search the web for information. Ask me to search for something specific.",
          "I can help answer questions by searching online sources like Google and Wikipedia. What would you like to know?",
          "I'm designed to assist with information retrieval. Try asking me to search for a topic you're interested in.",
          "I can search Google and Wikipedia for information. What topic would you like to learn about?",
        ];
        responseContent = generalResponses[Math.floor(Math.random() * generalResponses.length)];
      }
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
    } catch (error) {
      console.error('Error in AI response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error while processing your request. Please try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Helper function to extract the main query from a user message
  const extractQueryFromMessage = (message) => {
    // Remove search instruction words and keep the core query
    const searchPhrases = [
      'search for', 'look up', 'find information about', 'tell me about',
      'what is', 'who is', 'google', 'wikipedia', 'search'
    ];
    
    let query = message;
    for (const phrase of searchPhrases) {
      if (query.toLowerCase().includes(phrase)) {
        query = query.toLowerCase().replace(phrase, '').trim();
      }
    }
    
    // Return the query if it's not empty, otherwise return the original message
    return query.length > 0 ? query : message;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    getAIResponse(input);
    setInput('');
    setSearchSource(null);
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
      }}>
        <h1 style={{ color: '#4a4a4a', margin: 0 }}>AI Assistant</h1>
        <p style={{ color: '#888' }}>Ask questions and get real-time answers from Google & Wikipedia</p>
      </header>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            marginBottom: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '18px',
              backgroundColor: msg.role === 'user' ? '#1a73e8' : '#e2e2e2',
              color: msg.role === 'user' ? 'white' : 'black',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {msg.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < msg.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#888',
              marginTop: '5px',
              marginLeft: msg.role === 'user' ? 'auto' : '10px',
              marginRight: msg.role === 'user' ? '10px' : 'auto',
            }}>
              {msg.role === 'user' ? 'You' : 'AI Assistant'}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '10px',
            color: '#888'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e2e2e2',
              padding: '8px 16px',
              borderRadius: '18px',
            }}>
              <span style={{ marginRight: '5px' }}>Thinking</span>
              <span className="typing-animation" style={{
                display: 'inline-block',
                width: '20px',
                textAlign: 'left'
              }}>...</span>
            </div>
          </div>
        )}
        {searchSource && !isTyping && (
          <div style={{
            padding: '8px 12px',
            marginTop: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#666',
            display: 'inline-block',
            marginLeft: '10px'
          }}>
            {searchSource === 'google' && 'Searched Google'}
            {searchSource === 'wikipedia' && 'Searched Wikipedia'}
            {searchSource === 'both' && 'Searched Google & Wikipedia'}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something or search Google/Wikipedia..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '24px',
            border: '1px solid #ddd',
            fontSize: '16px',
            outline: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            padding: '0 20px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

const container = document.getElementById('renderDiv');
const root = ReactDOM.createRoot(container);
root.render(<App />);
