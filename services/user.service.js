import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { userTable } from "../models/user.model.js";




export const getUserByEmail = async (email)=>{


 const [existingUser] = await db
    .select({
      id: userTable.id,
      firstname: userTable.firstname,
      lastname: userTable.lastname,
      emai: userTable.email
    })
    .from(userTable)
    .where(eq(userTable.email, email));

    return existingUser;

}


export const createUser = async (email, firstname, lastname, hashedPassword, salt)=>{
      const user = await db
    .insert(userTable)
    .values({
      email,
      firstname,
      lastname,
      password: hashedPassword,
      salt: salt,
    })
    .returning({ id: userTable.id });


    return user
}