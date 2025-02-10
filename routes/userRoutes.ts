import express, { Request, Response, NextFunction } from "express";
import { fetchUserData, updateUserData, deleteUser, addPengguna } from "../controller/api";

import { authMiddleware } from "../middleware/authMiddleware";
import { db } from "../config/firebaseConfig";

const router = express.Router();

// 🔹 API untuk mengambil data pengguna berdasarkan ID

router.get("/user/:id", authMiddleware, fetchUserData);
router.put("/user/:id", authMiddleware, updateUserData);
router.post("/create-user", addPengguna);
router.delete('/users/:id', deleteUser);

// 🔹 API untuk mengecek koneksi ke Firebase Firestore
router.get("/test-firebase", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testDoc = db.collection("USERS").doc("testUser");
    await testDoc.set({ name: "Test User", email: "test@example.com" });

    res.json({ message: "✅ Firebase Firestore connection successful!" });
  } catch (error) {
    next(error);
  }
});

// 🔹 API untuk mengambil semua pengguna dari Firestore
router.get("/fetch-users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersRef = db.collection("USERS");
    const snapshot = await usersRef.get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default router;
