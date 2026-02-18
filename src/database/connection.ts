import db from './models/index.js';

export const connectToDb= async()=>{
    try {
        await db.sequelize.authenticate();
        console.log("connected to database")
    } catch(error: unknown) {
        if(error instanceof Error) {
            console.error("Unable to connect to database:", error.message);
        }
    }
}
connectToDb();