
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
   input CreateHackerInput {
      hackerName:String!
      hackerPassword:String!
   }
   input AddHackedSite{
      siteName:String!
      siteDescription:String!
      siteHackedYear:Int!
   }
   type AuthPayload {
  token: String!
  hacker: Hacker!
 }
   type Mutation {
      createHacker(input:CreateHackerInput!): AuthPayload!
      addHackedSites(input:AddHackedSites!) :HackedSite!
   }
 
  `;