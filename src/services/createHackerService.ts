import bcrypt from "bcrypt";
import type { typeOfhackers } from "../interfaces/exportTypesOfModels.js";
import jwt from "jsonwebtoken";
export interface IHackerInterface{
    id:string,
    hackerName:string,
}
 export interface IRetunedHackerObject {
        id: string,
        hackerName:string,
        hackerPassword?:string,
        createdAt?:Date,
        updatedAt?:Date,

}
export interface ITotalDataType {
    token:string,
     hacker:IHackerInterface
}
export const  createHackerHandler = async (hackerName:string,hackerPassword:string,Hackers: typeOfhackers):Promise<ITotalDataType> =>{
         if(!hackerName || !hackerPassword) {
             throw new Error("provide hackerName and hackerPassword");
         }
          const existingHacker = await Hackers.findOne ({
             where :{
                hackerName:hackerName,
             }
          });

          if(existingHacker) {
            throw new Error("this name is taken and claimed");
          }
                      
         const hashedPassword:string = await bcrypt.hash(hackerPassword,10);
        const newHacker:IRetunedHackerObject=  await Hackers.create({
            hackerName,
            hackerPassword:hashedPassword
         });
         const jwtSecret = process.env.jwtSecret as string;
         const token:string = jwt.sign(
            {
                id:newHacker.id,
                hackerName:newHacker.hackerName,
            },
             jwtSecret,
             {expiresIn:'1d'}
         );
const hacker:IHackerInterface ={
    id: newHacker.id,
    hackerName:newHacker.hackerName
};

         return {
            token,
            hacker
         }
}