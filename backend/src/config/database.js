import mongoose from "mongoose";

export async function connectDB() {
    try {
        const options = {};

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);

        console.log(`MongoDB connécté : ${conn.connection.host}`);
        console.log(`Base de données : ${conn.connection.name}`);

        return conn;
    } catch (error) {
        console.error(`Erreur de connexion à MongoDB : `);
        console.error(error.message);

        process.exit(1);
    }
}

export async function closeDB() {
    try {
        await mongoose.connection.close();
        console.log("Connexion Mongodb fermée");
    } catch (error) {
        console.error("Erreur lors de la fermeture de la connexion : ", error);
    }
}

process.on("SIGINT", async () => {
    await closeDB();
    process.exit(0);
});
