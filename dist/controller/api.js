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
exports.updateUserData = exports.fetchUserData = void 0;
const userCollection_1 = require("../repository/userCollection");
const firebaseConfig_1 = require("../config/firebaseConfig");
// export const fetchUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const userId = req.params.id;
//     const user = await getUserById(userId);
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }
//     res.json(user);
//   } catch (error) {
//     next(error); // Kirim error ke middleware Express
//   }
// };
const fetchUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersRef = firebaseConfig_1.db.collection("USERS");
        const snapshot = yield usersRef.get();
        const users = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || null, // Jika tidak ada, set null
                email: data.email || null,
                totalAverageWeightRatings: data.totalAverageWeightRatings || 0,
                numberOfRents: data.numberOfRents || 0,
                recentlyActive: data.recentlyActive || null,
            };
        });
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchUserData = fetchUserData;
const updateUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        yield (0, userCollection_1.updateUser)(userId, updatedData);
        res.json({ message: "User updated successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserData = updateUserData;
