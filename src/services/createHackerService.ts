import bcrypt from "bcrypt";
import type {
  typeOfhackedSite,
  typeOfhackers,
} from "../interfaces/exportTypesOfModels.js";
import jwt from "jsonwebtoken";
import type { IAddHackedSites } from "../schema/resolvers.js";
export interface IHackerInterface {
  id: string;
  hackerName: string;
  hackerId?:string;
  siteName?:string;
  siteDescription?:string;
  siteHackedYear?:number;
}
export interface IRetunedHackerObject {
  id: string;
  hackerName: string;
  hackerPassword?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ITotalDataType {
  token: string;
  hacker: IHackerInterface;
}
export interface INewSiteData {
    hackerId?:string;
  siteName?:string;
  siteDescription?:string;
  siteHackedYear?:number;
    
}
const  newSiteData:INewSiteData ={} ;

export const createHackerHandler = async (
  hackerName: string,
  hackerPassword: string,
  Hackers: typeOfhackers,
  hackedSites: IAddHackedSites | undefined,
  HackedSites: typeOfhackedSite,
): Promise<ITotalDataType> => {
  if (!hackerName || !hackerPassword) {
    throw new Error("provide hackerName and hackerPassword");
  }

  const existingHacker = await Hackers.findOne({
    where: {
      hackerName: hackerName,
    },
  });

  if (existingHacker) {
    throw new Error("this name is taken and claimed");
  }

  const hashedPassword: string = await bcrypt.hash(hackerPassword, 10);
  const newHacker: IRetunedHackerObject = await Hackers.create({
    hackerName,
    hackerPassword: hashedPassword,
  });

  if (typeof hackedSites !== "undefined") {
    const { siteName, siteDescription, siteHackedYear } = hackedSites;
    const  newSite = await HackedSites.create({
      hackerId: newHacker.id,
      siteName,
      siteDescription,
      siteHackedYear,
    });
    newSiteData.hackerId=newSite.hackerId;
    newSiteData.siteDescription=newSite.siteDescription; 
    newSiteData.siteHackedYear=newSite.siteHackedYear; 
    newSiteData.siteName=newSite.siteName; 


  }
  
  
  const jwtSecret = process.env.jwtSecret as string;
  const token: string = jwt.sign(
    {
      id: newHacker.id,
      hackerName: newHacker.hackerName,
    },
    jwtSecret,
    { expiresIn: "1d" },
  );

  const hacker: IHackerInterface = {
    id: newHacker.id,
    hackerName: newHacker.hackerName,
    
  };

  if(newSiteData.siteName && newSiteData.siteDescription && newSiteData.siteHackedYear && newSiteData.hackerId) {
           hacker.siteDescription=newSiteData.siteDescription;
           hacker.siteName=newSiteData.siteName;
           hacker.siteHackedYear=newSiteData.siteHackedYear;
           hacker.hackerId=newSiteData.hackerId;

  }

  return {
    token,
    hacker,
  };
};
