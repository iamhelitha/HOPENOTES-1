import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export async function fetchUniversityGroups() {
  const q = query(
    collection(db, "universityGroups"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function checkDuplicateUniversityLink(url) {
  try {
    const normalizedUrl = url.trim().toLowerCase();
    // Fetch all university groups and check in memory for case-insensitive matching
    const allGroups = await fetchUniversityGroups();
    return allGroups.some((group) => {
      const existingUrl = (group.url || "").trim().toLowerCase();
      return existingUrl === normalizedUrl;
    });
  } catch (error) {
    console.error("Error checking duplicate university link:", error);
    return false;
  }
}


