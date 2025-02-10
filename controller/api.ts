import { Request, Response, NextFunction } from "express";
import { getUserById, addUser, updateUser, deleteUserById } from "../repository/userCollection";
import { User } from "../entities/user";
import { db } from "../config/firebaseConfig";
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
// export const fetchUserData = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const usersRef = db.collection("USERS");
//     const snapshot = await usersRef.get();
//     const users = snapshot.docs.map((doc) => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         name: data.name || null,
//         email: data.email || null,
//         totalAverageWeightRatings: data.totalAverageWeightRatings || 0,
//         numberOfRents: data.numberOfRents || 0,
//         recentlyActive: data.recentlyActive 
//           ? new Date(data.recentlyActive * 1000).toISOString() // Konversi ke tanggal
//           : null,
//       };
//     });

//     res.json(users);
//   } catch (error) {
//     next(error);
//   }
// };
export const fetchUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ambil parameter untuk paginasi dari query (misalnya, limit dan startAfter)
    const limit = parseInt(req.query.limit as string) || 10;  // Default 10 hasil per halaman
    const lastVisible = req.query.lastVisible;  // Nilai dokumen terakhir yang diperoleh untuk paginasi

    // Query untuk mengambil data pengguna dan urutkan berdasarkan totalScore
    const usersRef = db.collection("USERS").orderBy("totalScore", "desc");

    // Jika ada parameter paginasi, gunakan startAfter
    let query = lastVisible ? usersRef.startAfter(lastVisible).limit(limit) : usersRef.limit(limit);

    const snapshot = await query.get();

    // Ambil dokumen pengguna
    const users = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Definisikan bobot untuk setiap faktor
      const W1 = 0.5;  // Bobot untuk Total Average Weight Ratings
      const W2 = 0.3;  // Bobot untuk Number of Rents
      const W3 = 0.2;  // Bobot untuk Recently Active

      // Hitung totalScore berdasarkan rumus yang sudah didefinisikan
      const totalScore = (W1 * (data.totalAverageWeightRatings || 0)) +
        (W2 * (data.numberOfRents || 0)) +
        (W3 * (data.recentlyActive || 0));

      // Simpan skor ke dalam dokumen jika diperlukan (untuk update future queries)
      doc.ref.update({ totalScore });

      return {
        id: doc.id,
        name: data.name || null,
        email: data.email || null,
        totalAverageWeightRatings: data.totalAverageWeightRatings || 0,
        numberOfRents: data.numberOfRents || 0,
        recentlyActive: data.recentlyActive ? new Date(data.recentlyActive * 1000).toISOString() : null,
        totalScore: totalScore  // Menyertakan totalScore pada hasil
      };
    });

    // Menyertakan informasi untuk paginasi (lastVisible adalah dokumen terakhir yang diambil)
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    res.json({
      users,
      lastVisible: lastDoc ? lastDoc.id : null  // Kirimkan ID dokumen terakhir untuk paginasi
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id;
    const updatedData: Partial<User> = req.body;

    await updateUser(userId, updatedData);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const addPengguna = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // try {
  //   const { name, email, totalAverageWeightRatings, numberOfRents, recentlyActive } = req.body;
  //   console.log("🔍 Data yang diterima:", req.body);

  //   if (!name || !email) {
  //     console.log("⚠️ Data tidak lengkap!");
  //     res.status(400).json({ message: "Name and email are required!" });
  //     return;
  //   }

  //   const userRef = db.collection("USERS").doc(name);
  //   const existingUser = await userRef.get();

  //   if (existingUser.exists) {
  //     console.log("❌ User dengan nama ini sudah ada!");
  //     res.status(400).json({ message: "User with this name already exists!" });
  //     return;
  //   }

  //   const newUser = {
  //     name,
  //     email,
  //     totalAverageWeightRatings: totalAverageWeightRatings || 0,
  //     numberOfRents: numberOfRents || 0,
  //     recentlyActive: recentlyActive || null,
  //   };

  //   console.log("📌 Menambahkan user:", newUser);
  //   await userRef.set(newUser);

  //   console.log("✅ User berhasil dibuat dengan ID:", name);
  //   res.status(201).json({ message: "User created successfully!", userId: name });
  // } catch (error) {
  //   console.error("❌ Error menambahkan user:", error);
  //   next(error);
  // }
  try {
    const { name, email, totalAverageWeightRatings, numberOfRents, recentlyActive } = req.body;
    console.log("🔍 Data yang diterima:", req.body);

    // Validasi data
    if (!name || !email) {
      console.log("⚠️ Data tidak lengkap!");
      res.status(400).json({ message: "Name and email are required!" });
      return;
    }

    // Cek apakah email sudah ada (email sebagai identifier unik)
    const existingUser = await db.collection("USERS").where("email", "==", email).get();
    if (!existingUser.empty) {
      console.log("❌ User dengan email ini sudah ada!");
      res.status(400).json({ message: "User with this email already exists!" });
      return;
    }

    // Buat user baru dengan ID otomatis
    const newUserRef = db.collection("USERS").doc();
    const newUser = {
      name,
      email,
      totalAverageWeightRatings: totalAverageWeightRatings || 0,
      numberOfRents: numberOfRents || 0,
      recentlyActive: recentlyActive || null,
    };

    console.log("📌 Menambahkan user:", newUser);
    await newUserRef.set(newUser);

    console.log("✅ User berhasil dibuat dengan ID:", newUserRef.id);
    res.status(201).json({ message: "User created successfully!", userId: newUserRef.id });
  } catch (error) {
    console.error("❌ Error menambahkan user:", error);
    next(error);
  }
};

// export const addPengguna = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { name, email, totalAverageWeightRatings, numberOfRents, recentlyActive } = req.body;
//     console.log("🔍 Data yang diterima:", req.body);

//     if (!name || !email) {
//       console.log("⚠️ Data tidak lengkap!");
//       res.status(400).json({ message: "Name and email are required!" });
//       return;
//     }

//     const newUserRef = db.collection("USERS").doc();
//     const newUser = {
//       name,
//       email,
//       totalAverageWeightRatings: totalAverageWeightRatings || 0,
//       numberOfRents: numberOfRents || 0,
//       recentlyActive: recentlyActive || null,
//     };

//     console.log("📌 Menambahkan user:", newUser);
//     await newUserRef.set(newUser);

//     console.log("✅ User berhasil dibuat dengan ID:", newUserRef.id);
//     res.status(201).json({ message: "User created successfully!", userId: newUserRef.id });
//   } catch (error) {
//     console.error("❌ Error menambahkan user:", error);
//     next(error);
//   }
// };



export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Call the repository function to delete the user
    const isDeleted = await deleteUserById(id);

    if (isDeleted) {
      // If deletion is successful, respond with success message
      res.status(200).json({ message: `User with ID ${id} deleted successfully.` });
    } else {
      // If user does not exist, respond with 404
      res.status(404).json({ message: `User with ID ${id} not found.` });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error(`Error while deleting user with ID ${id}:`, error);
    res.status(500).json({ message: "An error occurred while deleting the user.", error });
  }
};