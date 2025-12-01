import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export async function fetchWhatsappGroups() {
  const q = query(
    collection(db, "whatsappGroups"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function checkDuplicateWhatsappLink(url) {
  try {
    const normalizedUrl = url.trim().toLowerCase();
    // Fetch all WhatsApp groups and check in memory for case-insensitive matching
    const allGroups = await fetchWhatsappGroups();
    return allGroups.some((group) => {
      const existingUrl = (group.url || "").trim().toLowerCase();
      return existingUrl === normalizedUrl;
    });
  } catch (error) {
    console.error("Error checking duplicate WhatsApp link:", error);
    return false;
  }
}


