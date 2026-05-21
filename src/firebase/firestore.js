import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// ── User Profiles ───────────────────────────────────────────────────────────

export async function createUserProfile(uid, data) {
  return setDoc(doc(db, "userProfiles", uid), {
    uid,
    points: 0,
    completedActions: [],
    badges: [],
    certificates: [],
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "userProfiles", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateUserProfile(uid, data) {
  return updateDoc(doc(db, "userProfiles", uid), data);
}

// ── Supporters ──────────────────────────────────────────────────────────────

export async function addSupporter(uid, data) {
  return addDoc(collection(db, "supporters"), {
    uid,
    ...data,
    createdAt: serverTimestamp(),
    isApproved: true,
  });
}

export async function getSupporters() {
  const q = query(collection(db, "supporters"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getSupporter(uid) {
  const q = query(collection(db, "supporters"), where("uid", "==", uid), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function updateSupporter(docId, data) {
  return updateDoc(doc(db, "supporters", docId), data);
}

export async function deleteSupporter(docId) {
  return deleteDoc(doc(db, "supporters", docId));
}

// ── Gallery ─────────────────────────────────────────────────────────────────

export async function addGalleryImage(data) {
  return addDoc(collection(db, "gallery"), {
    ...data,
    uploadedAt: serverTimestamp(),
  });
}

export async function getGallery(pageLimit = 20) {
  const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"), limit(pageLimit));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteGalleryImage(docId) {
  return deleteDoc(doc(db, "gallery", docId));
}
