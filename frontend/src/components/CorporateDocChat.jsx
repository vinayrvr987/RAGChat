import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, FileText, X, MessageCircle, Building2 } from 'lucide-react';
import './CorporateDocChat.css';

const CorporateDocChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = (files) => {
    const newDocs = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setUploadedDocs(prev => [...prev, ...newDocs]);

    // Upload each file to FastAPI
    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch('http://localhost:8000/upload', {

          method: "POST",
          body: formData
        });

        if (!res.ok) {
          throw new Error(`Upload failed: ${res.status}`);
        }

        const data = await res.json();
        console.log("File uploaded:", data);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeDocument = (docId) => {
    setUploadedDocs(prev => prev.filter(doc => doc.id !== docId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || uploadedDocs.length === 0) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Call FastAPI endpoint for AI response
    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputMessage,
          session_id: "user123"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiResponse = {
        id: Date.now() + 1,
        text: data.generated_text,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        sources: [`Document: ${uploadedDocs[0]?.name || 'Unknown'}`]
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      // Fallback error response
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        sources: []
      };
      
      setMessages(prev => [...prev, errorResponse]);
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="app-title">
            <Building2 size={24} />
            <h1>Corporate Doc Chat</h1>
          </div>
          
          {/* File Upload Area */}
          <div 
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload size={32} />
            <p>Drag & drop documents here or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="browse-btn"
            >
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md"
              onChange={(e) => handleFileUpload(e.target.files)}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="documents-section">
          <h3>Uploaded Documents ({uploadedDocs.length})</h3>
          <div className="documents-list">
            {uploadedDocs.map((doc) => (
              <div key={doc.id} className="document-item">
                <FileText size={20} />
                <div className="document-info">
                  <p className="document-name">{doc.name}</p>
                  <p className="document-size">{formatFileSize(doc.size)}</p>
                </div>
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="remove-btn"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="header-content">
            <MessageCircle size={20} />
            <h2>Document Q&A</h2>
            {uploadedDocs.length > 0 && (
              <span className="doc-count">
                • {uploadedDocs.length} document{uploadedDocs.length !== 1 ? 's' : ''} loaded
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <MessageCircle size={48} />
              <p className="empty-title">Ready to answer your questions</p>
              <p className="empty-subtitle">Upload documents and start asking questions about their content</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-bubble">
                  <p className="message-text">{message.text}</p>
                  {message.sources && (
                    <div className="message-sources">
                      <p className="sources-label">Sources:</p>
                      {message.sources.map((source, index) => (
                        <p key={index} className="source-item">{source}</p>
                      ))}
                    </div>
                  )}
                  <p className="message-timestamp">{message.timestamp}</p>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="message ai">
              <div className="message-bubble">
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <span>Analyzing documents...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          {uploadedDocs.length === 0 && (
            <div className="warning-message">
              <p>Please upload at least one document to start asking questions.</p>
            </div>
          )}
          
          <div className="input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={uploadedDocs.length > 0 ? "Ask a question about your documents..." : "Upload documents first..."}
              disabled={uploadedDocs.length === 0}
              className="message-input"
              rows="1"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || uploadedDocs.length === 0 || isLoading}
              className="send-btn"
            >
              <Send size={16} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateDocChat;