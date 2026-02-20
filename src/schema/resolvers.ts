import { QueryTypes } from "sequelize";
import type { IContext } from "../context/auth.context.js"
import dotenv from 'dotenv';
import { createHackerHandler,  type IHackerInterface,  type ITotalDataType } from "../services/createHackerService.js";
dotenv.config();

interface IReturnOnHackerRegistration {
    token:string,
    hacker:IHacker
}
export interface IHacker {
        id?:string,
         hackerName:string,
         hackerPassword:string,
         hackedSites?:IHackedSite
}
interface IHackedSite {
     id?:string, 
     siteName:string,
     siteDescription:string,    
     siteHackedYear:number

}
interface IHackerNameAndId{
    id:string,
    hackerName:string
}
export interface IAddHackedSites {
     hackerId?:string,
     siteName:string,
     siteDescription:string,    
     siteHackedYear:number,
}
interface IGethacker{
     name: string,
}
export const resolvers ={
    Query :{
        //get one hacker
        hacker:async(parent:undefined, args:{input:IGethacker},context :IContext ):Promise<IHackerNameAndId> =>{
            const {Sequelize,sequelize} = context.models;
              console.log("Args received:", args);
            const hackerData :IHackerNameAndId|null= await sequelize.query(
                `Select id,"hackerName" 
                FROM table_hackers
                WHERE "hackerName"=:inputName
                LIMIT 1`,{
                    replacements:{inputName: args.input.name},
                    plain:true,  //to return one object instead of an array

                    type:QueryTypes.SELECT,
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
                `Select "siteName", "siteDescription","siteHackedYear"
                from table_hacked_sites WHERE "hackerId"=:parentId `,{
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
        createHacker:async(parent:undefined, args:{input:IHacker},context:IContext):Promise<ITotalDataType> =>{
         const {hackerName, hackerPassword,hackedSites} = args.input;
         
         const {Hackers,HackedSites} = context.models;
         const hackedSitesModel =context.models.HackedSites;
         const result =await createHackerHandler(hackerName,hackerPassword,Hackers,hackedSites,HackedSites);
       
         return {
            token:result.token,
            hacker:result.hacker
        
         };
         
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