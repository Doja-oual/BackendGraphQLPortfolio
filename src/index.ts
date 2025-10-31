import express, { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database';

dotenv.config();

interface MyContext {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
  isAuthenticated: boolean;
}

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const app = express();

    const httpServer = http.createServer(app);

    const typeDefs = `#graphql
      type Query {
        hello: String!
        portfolio: String!
        status: ServerStatus!
      }

      type ServerStatus {
        message: String!
        timestamp: String!
        database: String!
      }
    `;

    // Resolvers GraphQL
    const resolvers = {
      Query: {
        hello: (): string => 'Hello World! GraphQL Server is running 🚀',
        portfolio: (): string => 'Welcome to Portfolio Backend API',
        status: () => ({
          message: 'Server is running',
          timestamp: new Date().toISOString(),
          database: 'Connected'
        })
      }
    };

    const server = new ApolloServer<MyContext>({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      introspection: true,
    });

    
    await server.start();

    
    const corsOptions = {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    };

    
    app.use(
      '/graphql',
      cors(corsOptions),
      express.json(),
      expressMiddleware(server, {
        context: async (): Promise<MyContext> => {
          return { 
            isAuthenticated: false 
          };
        }
      })
    );

    
    app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        database: 'Connected',
        version: '1.0.0'
      });
    });

    
    app.get('/', (req: Request, res: Response) => {
      res.json({
        message: 'Portfolio Backend API',
        version: '1.0.0',
        endpoints: {
          graphql: '/graphql',
          health: '/health'
        },
        documentation: 'https://github.com/Doja-oual/BackendGraphQLPortfolio'
      });
    });

  
    const PORT = parseInt(process.env.PORT || '4000', 10);

    
    await new Promise<void>((resolve) => 
      httpServer.listen({ port: PORT }, resolve)
    );

    console.log('========================================');
    console.log(`Server started successfully`);
    console.log(` Port: ${PORT}`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(`GraphQL: http://localhost:${PORT}/graphql`);
    console.log(`  Health: http://localhost:${PORT}/health`);
    console.log('========================================');

  } catch (error) {
    console.error('========================================');
    console.error(' Error starting server:');
    console.error(error);
    console.error('========================================');
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();