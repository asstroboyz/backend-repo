import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;

    next(); // Panggil next tanpa return
  } catch (error) {
    res.status(403).json({ message: "Unauthorized: Invalid token" });
  }
};
