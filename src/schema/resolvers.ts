import { QueryTypes } from "sequelize";
import type { IContext } from "../context/auth.context.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

interface IReturnOnHackerRegistration {
    token:string,
    hacker:IHacker
}
interface IHacker {
        id?:string,
         hackerName:string,
         hackerPassword:string,
         hackedSites?:IHackedSite[]
}
interface IHackedSite {
     id:string, 
     siteName:string,
     siteDescription:string,    
     siteHackedYear:number

}
interface IHackerNameAndId{
    id:string,
    hackerName:string
}
interface IAddHackedSites {
     hackerId?:string,
     siteName:string,
     siteDescription:string,    
     siteHackedYear:number,
}
export const resolvers ={
    Query :{
        //get one hacker
        hacker:async(parent:undefined, args:{name:string},context :IContext ):Promise<IHackerNameAndId> =>{
            const {Sequelize,sequelize} = context.models;

            const hackerData :IHackerNameAndId|null= await sequelize.query(
                `Select id,hackerName 
                FROM table_hackers
                WHERE hackerName=:inputName
                LIMIT 1`,{
                    replacements:{inputName: args.name},
                    type:QueryTypes.SELECT,
                    plain:true,  //to return one object instead of an array
                }
            );

            if(hackerData===null) {
                throw new Error("no user found with that name");

            }
            return hackerData;
        },

        //get all hackers
        hackers:async (parent:undefined ,args:null ,context:IContext):Promise<IHackerNameAndId[]>=>{
            const {Hackers} = context.models;
            const hackersData:Array<IHackerNameAndId>= await Hackers.findAll({
                attributes:['id','hackerName'],
                // raw:true
            });
            return hackersData;
        }  
    },
    //field resolver for nested field
    Hacker: {
        hackedSites:async (parent:IHacker , args:null,context:IContext):Promise<IHackedSite[]>=>{
            const {sequelize} = context.models;

            const hackedSiteData:IHackedSite[]=await sequelize.query<IHackedSite> (
                `Select siteName, siteDescription,siteHackedYear
                from table_hacked_sites WHERE hackerId=:parentId `,{
                    replacements:{parentId:parent.id},
                    type:QueryTypes.SELECT,
                    plain:false  //this returns an array and is the default

                }
            );
               //as if tehres no data, it will still return an empty array, and we have used plain :true
               //which absolutely means an array instead of an object, ts wont throw an error even though
               //im returning a potential [] empty array
            return hackedSiteData;
             
        },
    },
   Mutation: {

    //register a hacker profile
        createHacker:async(parent:undefined, args:{input:IHacker},context:IContext):Promise<IReturnOnHackerRegistration> =>{
         const {hackerName, hackerPassword} = args.input;
         const {Hackers} = context.models;
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
         type HackerType = InstanceType<typeof Hackers>;
                      
         const hashedPassword:string = await bcrypt.hash(hackerPassword,10);
        const newHacker:HackerType=  await Hackers.create({
            hackerName,
            hackerPassword:hashedPassword
         });
         const hacker =newHacker;
         const jwtSecret = process.env.jwtSecret as string;
         const token:string = jwt.sign(
            {
                id:newHacker.id,
                hackerName:newHacker.hackerName,
            },
             jwtSecret,
             {expiresIn:'1d'}
         );


         return {
            token,
            hacker
         }
         
       },

   addHackedSites: async(parent:undefined, args:{input:IAddHackedSites}, context:IContext):Promise<IAddHackedSites>=>{
        if(!context.user) {
            throw new Error("unauthenticated  hacker, no payload provided");
        }
         const {siteName, siteDescription,siteHackedYear} = args.input;
          const hackerId = context.user.id;
        const newSite = await context.models.HackedSites.create({
        hackerId: hackerId, 
        siteName,
        siteDescription,
        siteHackedYear
    });
    return newSite;
   }, //end of adding hacker achievement

   }//mutation end



}