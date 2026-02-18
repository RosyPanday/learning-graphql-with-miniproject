
export const typeDefs =`#graphql 
   type Hacker {
         id:ID!
         hackerName:String!
         hackedSites:[hackedSite!]
   }
   type hackedSite {
         id:ID!
         siteName:String!
         siteDescription:String!
         siteHackedYear:Int!
   }
   input HackerInput {
           name: String!
   }
   type Query {
       hacker(input: HackerInput!) :Hacker!
       hackers :[Hacker!]
   }
 
  `;