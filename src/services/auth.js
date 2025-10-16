// 用户认证服务
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../config/firebase.js';

// 注册新用户
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 可以在这里更新用户资料
    // await updateProfile(user, { displayName });
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.email
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 用户登录
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 用户退出
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 监听认证状态变化
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
