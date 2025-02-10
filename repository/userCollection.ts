import { db } from "../config/firebaseConfig";
import { User } from "../entities/user";

const usersCollection = db.collection("USERS");

export const getUserById = async (id: string): Promise<User | null> => {
  const userDoc = await usersCollection.doc(id).get();
  return userDoc.exists ? (userDoc.data() as User) : null;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<void> => {
  await usersCollection.doc(id).update(userData);
};
export const addUser = async (user: User) => {
  const newUser = await usersCollection.add(user);
  return { id: newUser.id, ...user };
};

export const deleteUserById = async (id: string): Promise<boolean> => {
  try {
    const userDoc = await usersCollection.doc(id).get();
    if (!userDoc.exists) {
      console.error(`User with ID ${id} does not exist.`);
      return false;
    }

    await usersCollection.doc(id).delete();
    return true; // Berhasil dihapus
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
