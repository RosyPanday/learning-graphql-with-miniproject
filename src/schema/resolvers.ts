import { QueryTypes } from "sequelize";
import type { IContext } from "../context/auth.context.js"

interface IHacker {
        id:string,
         hackerName:string,
         hackedSites:IHackedSite[]
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
                    plain:true,
                }
            );

            if(hackerData===null) {
                throw new Error("no user found with that name");

            }
            return hackerData;
        },

        //get all hackers
        hackers: (parent:undefined ,args:null ,context:IContext):Promise<IHackerNameAndId>=>{
            const {Hackers} = context.models;
            const hackersData:Array<IHackerNameAndId>= Hackers.findAll();
            return hackersData;
        }  
    },
    Hacker: {
        hackedSites:(parent:IHacker , args:null)=>{
             
        },
    },


}