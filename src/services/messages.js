// 消息管理服务
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

const MESSAGES_COLLECTION = 'messages';

// 发布新消息
export const createMessage = async (messageData, userId, userName) => {
  try {
    const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
      title: messageData.title,
      content: messageData.content,
      authorId: userId,
      authorName: userName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      messageId: docRef.id
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 获取所有消息
export const getAllMessages = async () => {
  try {
    const q = query(
      collection(db, MESSAGES_COLLECTION), 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      messages
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 实时监听消息变化
export const subscribeToMessages = (callback) => {
  const q = query(
    collection(db, MESSAGES_COLLECTION), 
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(messages);
  });
};

// 更新消息
export const updateMessage = async (messageId, updateData, userId) => {
  try {
    const messageRef = doc(db, MESSAGES_COLLECTION, messageId);
    await updateDoc(messageRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 删除消息
export const deleteMessage = async (messageId, userId) => {
  try {
    const messageRef = doc(db, MESSAGES_COLLECTION, messageId);
    await deleteDoc(messageRef);
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
