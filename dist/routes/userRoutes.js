"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express from "express";
const express_1 = __importDefault(require("express"));
const api_1 = require("../controller/api");
const authMiddleware_1 = require("../middleware/authMiddleware");
const firebaseConfig_1 = require("../config/firebaseConfig");
const router = express_1.default.Router();
router.get("/user/:id", authMiddleware_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, api_1.fetchUserData)(req, res, next);
}));
router.put("/user/:id", authMiddleware_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, api_1.updateUserData)(req, res, next);
}));
router.get("/test-firebase", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const testDoc = firebaseConfig_1.db.collection("USERS").doc("testUser");
        yield testDoc.set({ name: "Test User", email: "test@example.com" });
        res.json({ message: "✅ Firebase Firestore connection successful!" });
    }
    catch (error) {
        next(error); // ✅ Tangani error dengan `next()`
    }
}));
// 🔹 API untuk fetch data dari Firestore
router.get("/fetch-users", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersRef = firebaseConfig_1.db.collection("USERS");
        const snapshot = yield usersRef.get();
        const users = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        res.json(users);
    }
    catch (error) {
        next(error); // ✅ Tangani error dengan `next()`
    }
}));
router.get("/test-firebase", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const testDoc = firebaseConfig_1.db.collection("USERS").doc("testUser");
        yield testDoc.set({ name: "Test User", email: "test@example.com" });
        res.json({ message: "✅ Firebase Firestore connection successful!" });
    }
    catch (error) {
        next(error);
    }
}));
// 🔹 API untuk fetch data dari Firestore
router.get("/fetch-users", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersRef = firebaseConfig_1.db.collection("USERS");
        const snapshot = yield usersRef.get();
        const users = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        res.json(users);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
