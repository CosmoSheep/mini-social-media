import React, { useState, useEffect } from 'react';
import { onAuthChange } from './services/auth.js';
import Header from './components/Header.jsx';
import AuthForm from './components/AuthForm.jsx';
import MessageForm from './components/MessageForm.jsx';
import MessageList from './components/MessageList.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshMessages, setRefreshMessages] = useState(0);

  useEffect(() => {
    // 监听认证状态变化
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleMessageCreated = () => {
    // 触发消息列表刷新
    setRefreshMessages(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="app-main">
        {!user ? (
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        ) : (
          <div className="main-content">
            <MessageForm 
              user={user} 
              onMessageCreated={handleMessageCreated}
            />
            <MessageList 
              currentUser={user}
              refreshTrigger={refreshMessages}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 简易版 X.com - 课后作业项目</p>
      </footer>
    </div>
  );
}

export default App;
