import React, { useState } from 'react';
import { updateMessage, deleteMessage } from '../services/messages.js';
import { Edit2, Trash2, Save, X } from 'lucide-react';

const MessageCard = ({ message, currentUser, onMessageUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: message.title,
    content: message.content
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAuthor = currentUser && currentUser.uid === message.authorId;

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: message.title,
      content: message.content
    });
  };

  const handleSave = async () => {
    if (!editData.title.trim() || !editData.content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await updateMessage(message.id, editData, currentUser.uid);
      if (result.success) {
        setIsEditing(false);
        onMessageUpdated && onMessageUpdated();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('更新失败，请重试');
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('确定要删除这条消息吗？')) return;

    setLoading(true);
    try {
      const result = await deleteMessage(message.id, currentUser.uid);
      if (result.success) {
        onMessageUpdated && onMessageUpdated();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('删除失败，请重试');
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: message.title,
      content: message.content
    });
    setError('');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('zh-CN');
  };

  return (
    <div className="message-card">
      <div className="message-header">
        <div className="message-meta">
          <span className="author-name">{message.authorName}</span>
          <span className="message-time">{formatDate(message.createdAt)}</span>
        </div>
        
        {isAuthor && (
          <div className="message-actions">
            {!isEditing ? (
              <>
                <button onClick={handleEdit} className="action-button edit-button">
                  <Edit2 size={16} />
                </button>
                <button onClick={handleDelete} className="action-button delete-button" disabled={loading}>
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} className="action-button save-button" disabled={loading}>
                  <Save size={16} />
                </button>
                <button onClick={handleCancel} className="action-button cancel-button">
                  <X size={16} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="message-content">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="edit-title"
              placeholder="标题"
              maxLength="100"
            />
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              className="edit-content"
              placeholder="内容"
              rows="3"
              maxLength="500"
            />
          </div>
        ) : (
          <>
            <h4 className="message-title">{message.title}</h4>
            <p className="message-text">{message.content}</p>
          </>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {message.updatedAt && message.updatedAt !== message.createdAt && (
        <div className="updated-indicator">
          已编辑 • {formatDate(message.updatedAt)}
        </div>
      )}
    </div>
  );
};

export default MessageCard;
