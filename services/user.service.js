import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { userTable } from "../models/user.model.js";




export const getUserByEmail = async (email)=>{


 const [exitingUser] = await db
    .select({
      id: userTable.id,
      firstname: userTable.firstname,
      lastname: userTable.lastname,
      emai: userTable.email
    })
    .from(userTable)
    .where(eq(userTable.email, email));


    return exitingUser;

}