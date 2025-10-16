import React, { useState } from 'react';
import { createMessage } from '../services/messages.js';

const MessageForm = ({ user, onMessageCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('请填写标题和内容');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await createMessage(
        formData,
        user.uid,
        user.displayName
      );

      if (result.success) {
        setFormData({ title: '', content: '' });
        onMessageCreated && onMessageCreated();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('发布失败，请重试');
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="message-form-container">
      <div className="message-form-card">
        <h3>📝 发布新消息</h3>
        
        <form onSubmit={handleSubmit} className="message-form">
          <div className="form-group">
            <label htmlFor="title">标题</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="输入消息标题..."
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">内容</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="分享你的想法..."
              rows="4"
              maxLength="500"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <div className="char-count">
              {formData.content.length}/500
            </div>
            <button type="submit" disabled={loading} className="publish-button">
              {loading ? '发布中...' : '发布'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageForm;
