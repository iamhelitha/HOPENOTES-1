import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export async function fetchDriveLinks() {
  const q = query(
    collection(db, "driveLinks"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function checkDuplicateDriveLink(url) {
  try {
    const normalizedUrl = url.trim().toLowerCase();
    // Fetch all drive links and check in memory for case-insensitive matching
    const allLinks = await fetchDriveLinks();
    return allLinks.some((link) => {
      const existingUrl = (link.url || "").trim().toLowerCase();
      return existingUrl === normalizedUrl;
    });
  } catch (error) {
    console.error("Error checking duplicate drive link:", error);
    return false;
  }
}

