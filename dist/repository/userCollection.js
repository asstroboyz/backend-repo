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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserById = void 0;
const firebaseConfig_1 = require("../config/firebaseConfig");
const usersCollection = firebaseConfig_1.db.collection("USERS");
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userDoc = yield usersCollection.doc(id).get();
    return userDoc.exists ? userDoc.data() : null;
});
exports.getUserById = getUserById;
const updateUser = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    yield usersCollection.doc(id).update(userData);
});
exports.updateUser = updateUser;
