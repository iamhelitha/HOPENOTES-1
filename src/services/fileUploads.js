import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase.js';

/**
 * Fetch all file uploads from Firestore
 * @returns {Promise<Array>} Array of file upload documents
 */
export async function fetchFileUploads() {
  try {
    const q = query(collection(db, 'fileUploads'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const uploads = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('Fetched file uploads:', uploads.length, uploads);
    return uploads;
  } catch (error) {
    console.error('Error fetching file uploads:', error);
    // If orderBy fails (no createdAt field), try without ordering
    try {
      const querySnapshot = await getDocs(collection(db, 'fileUploads'));
      const uploads = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched file uploads (without ordering):', uploads.length, uploads);
      return uploads;
    } catch (fallbackError) {
      console.error('Error fetching file uploads (fallback):', fallbackError);
      return [];
    }
  }
}

