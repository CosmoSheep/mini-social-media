import React, { useState, useEffect } from 'react';
import { subscribeToMessages } from '../services/messages.js';
import MessageCard from './MessageCard.jsx';

const MessageList = ({ currentUser, refreshTrigger }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    
    // 订阅实时消息更新
    const unsubscribe = subscribeToMessages((newMessages) => {
      setMessages(newMessages);
      setLoading(false);
    });

    // 清理订阅
    return () => unsubscribe();
  }, [refreshTrigger]);

  const handleMessageUpdated = () => {
    // 消息更新后的回调，由于使用实时监听，这里不需要手动刷新
  };

  if (loading) {
    return (
      <div className="message-list-container">
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>加载消息中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message-list-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="message-list-container">
      <div className="message-list-header">
        <h3>📋 所有消息 ({messages.length})</h3>
      </div>
      
      {messages.length === 0 ? (
        <div className="empty-state">
          <p>🌟 还没有消息，成为第一个发布者吧！</p>
        </div>
      ) : (
        <div className="message-list">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              currentUser={currentUser}
              onMessageUpdated={handleMessageUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;
