import express, { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database';
import { getAuthContext, requireAuth, requireAdmin, AuthContext } from './middleware/auth';
import { generateToken } from './utils/jwt';
import User from './models/User';

dotenv.config();

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const app = express();
    const httpServer = http.createServer(app);

    
    const typeDefs = `#graphql
      type Query {
        hello: String!
        me: User
        users: [User!]!
      }

      type Mutation {
        login(email: String!, password: String!): AuthPayload!
        register(username: String!, email: String!, password: String!): AuthPayload!
      }

      type User {
        id: ID!
        username: String!
        email: String!
        role: Role!
        createdAt: String!
      }

      type AuthPayload {
        token: String!
        user: User!
      }

      enum Role {
        ADMIN
        USER
      }
    `;

  
    const resolvers = {
      Query: {
        hello: () => 'Hello World! GraphQL Server is running ',
        
        
        me: async (_: any, __: any, context: AuthContext) => {
          requireAuth(context);
          const user = await User.findById(context.user?.userId);
          return user;
        },
        
        
        users: async (_: any, __: any, context: AuthContext) => {
          requireAdmin(context);
          const users = await User.find();
          return users;
        }
      },

      Mutation: {
        
        login: async (_: any, { email, password }: { email: string; password: string }) => {
          
          const user = await User.findOne({ email: email.toLowerCase() });
          
          if (!user) {
            throw new Error('Email ou mot de passe incorrect');
          }

          
          const isValidPassword = await user.comparePassword(password);
          
          if (!isValidPassword) {
            throw new Error('Email ou mot de passe incorrect');
          }

          
          const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
          });

          return {
            token,
            user
          };
        },

        
        register: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
          // Vérifier si l'utilisateur existe déjà
          const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
          });

          if (existingUser) {
            throw new Error('Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà');
          }

          
          const user = await User.create({
            username,
            email: email.toLowerCase(),
            password,
            role: 'USER'
          });

        
          const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
          });

          return {
            token,
            user
          };
        }
      }
    };

    const server = new ApolloServer<AuthContext>({
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
        context: async ({ req }): Promise<AuthContext> => {
          return getAuthContext(req);
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
        }
      });
    });

    const PORT = parseInt(process.env.PORT || '4000', 10);

    await new Promise<void>((resolve) => 
      httpServer.listen({ port: PORT }, resolve)
    );

    console.log('========================================');
    console.log(` Server started successfully`);
    console.log(` Port: ${PORT}`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` GraphQL: http://localhost:${PORT}/graphql`);
    console.log(`  Health: http://localhost:${PORT}/health`);
    console.log('========================================');

  } catch (error) {
    console.error(' Error starting server:', error);
    process.exit(1);
  }
};

startServer();