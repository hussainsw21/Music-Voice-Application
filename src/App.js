import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [isListening, setIsListening] = useState(false);

  // Speech Recognition setup from the library
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Check if browser supports speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert('Browser does not support speech recognition. Please try using Chrome or an updated browser.');
    }
  }, [browserSupportsSpeechRecognition]);

  // Function to handle voice search
  const handleSearch = async (query) => {
    if (query.trim()) {
      try {
        // Send the query (from voice input) to the backend API
        const response = await axios.get(`http://localhost:4000/search?q=${query}`);
        
        // Set the results from the response to state
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  // Start/Stop listening to voice
  const handleVoiceInput = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
      handleSearch(transcript);  // Perform search with the final transcript
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    }
  };

  // Render search results
  const renderResults = () => {
    if (results.length === 0) {
      return <p>No results found</p>;
    }

    return results.map((result, index) => (
      <div key={index} className="result">
        <h3>{result.name}</h3>
        <p><strong>Artist:</strong> {result.artists.map(artist => artist.name).join(', ')}</p>
        {result.album && (
          <div>
            <p><strong>Album:</strong> {result.album.name}</p>
            <img src={result.album.images[0]?.url} alt={result.album.name} style={{ width: '200px' }} />
          </div>
        )}
        <p><strong>Popularity:</strong> {result.popularity}</p>
        <a href={result.external_urls.spotify} target="_blank" rel="noopener noreferrer">
          Listen on Spotify
        </a>
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>Music Voice Search</h1>

      {/* Voice Search Button */}
      <button onClick={handleVoiceInput}>
        {listening ? 'Stop Listening' : 'Start Voice Search'}
      </button>

      {/* Display the transcript from voice recognition */}
      <p>Transcript: {transcript}</p>

      {/* Clear transcript button */}
      <button onClick={resetTranscript}>Clear Transcript</button>

      {/* Display search results */}
      <div className="results-container">
        {renderResults()}
      </div>

      <footer className="footer">
        <p>&copy; 2024 Developed and Maintained by Hussain Shajapur Wala</p>
      </footer>
    </div>
  );
}

export default App;
