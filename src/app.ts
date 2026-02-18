import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServer} from '@apollo/server';
import express from 'express';
import type {Express} from 'express';
import http from 'node:http';
import { expressMiddleware } from '@as-integrations/express5';
import { verifyTokenContext, type IContext } from './context/auth.context.js';
 import db from './database/models/index.js';
 import { connectToDb } from './database/connection.js'; 
 
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
 const app:Express = express();
 const httpServer :http.Server =http.createServer(app);


 //server is an instance of ApolloServer class explicityly typed or it can be base context inferred 
  const server= new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({httpServer})
      ]
  });


  async function startServer() {
    try{
       await server.start();
       console.log('Apollo Server started successfully');
    }catch(error) {
        if(error instanceof Error) {
            console.error('Error starting Apollo Server:', error.message);
        }
    }

        app.use(
            '/graphql',
            express.json(),
            expressMiddleware(server,{
                context :verifyTokenContext,
                //its getting {user:decoded} , so context now has user property, accessing can be done with conetext.user.id etc
            })
        );
         const PORT:number = Number(process.env.PORT)||3000;
        httpServer.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/graphql`);
        });
     
  }

startServer();
 