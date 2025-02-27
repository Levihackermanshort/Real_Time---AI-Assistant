# Real_Time---AI-Assistant

 Chat assistant similar to chatgpt with response capbilities in chat while connected to google/wikipedia

 React-based chat interface that simulates an AI assistant with mock connections to external knowledge sources like Google and Wikipedia. Since actual API integration requires authentication tokens, I'll create a simulation that demonstrates the UI and interaction patterns.

 Integrate real search APIs with your chat assistant.
To connect your chat interface with actual Google and Wikipedia data sources, you'll need:

1-Set up a backend server (Node.js/Express) to securely handle API calls
2-Integrate real search APIs using proper authentication
3-The backend server will protect your API keys and provide endpoints for your React frontend to call. You'll need to register for Google's Custom Search JSON API and set up Wikipedia API access through their MediaWiki API.

Implement the real API integration for the chat assistant. This requires:

1-Creating API service files to handle external requests
2-Modifying the React component to make real API calls instead of using mock data
3-Adding proper error handling and loading states

Here is alos important code snippets

Update the form submission handler to use our new API-connected function:
<<<<<<< HEAD
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    simulateAIResponse(input);
    setInput('');
    setSearchSource(null);
  };
=======
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    getAIResponse(input);
    setInput('');
    setSearchSource(null);
  };
>>>>>>> updated


Update the UI to reflect that we're now using real APIs:

<<<<<<< HEAD
        <h1 style={{ color: '#4a4a4a', margin: 0 }}>AI Assistant</h1>
        <p style={{ color: '#888' }}>Ask questions and get answers with simulated Google/Wikipedia search</p>
=======
        <h1 style={{ color: '#4a4a4a', margin: 0 }}>AI Assistant</h1>
        <p style={{ color: '#888' }}>Ask questions and get real-time answers from Google & Wikipedia</p>
>>>>>>> updated


So
>>>>>>> These changes integrate real API calls to Google and Wikipedia through backend endpoints that you would implement separately. The component now properly extracts search queries from user messages, makes appropriate API calls, and handles errors gracefully.

For this to work completely, you would need to implement the backend API endpoints
>>>>>>> 



Also here is what it looks like (Not Yet Functional Only Beta aka under development for now):
![image](https://github.com/user-attachments/assets/96202127-af59-4b5a-9c91-d693021b6746)
