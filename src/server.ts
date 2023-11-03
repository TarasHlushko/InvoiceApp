import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { testDbConnection } from './config/dbConfig.js';
import { schemaConfig } from './config/schemaConfig.js';
import dotenv from 'dotenv';
import throwCustomError, { ErrorType } from './util/error-handler.js';
import jwt from 'jsonwebtoken';

dotenv.config();

export const server = new ApolloServer({ schema: schemaConfig });

const startServer = async() => {
  const {url} = await startStandaloneServer(server, {
    listen: {
      port: +process.env.SERVER_PORT,
    },
    context: async ({req}) => {
      let token;
      if (
          req.headers.authorization &&
          req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }
      if (!token) {
        return {};
      }

      try {
        const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);

        return {tokenPayload};
      } catch (error) {
        throwCustomError('Invalid or expired token', ErrorType.UNAUTHORIZED);
      }
    },
  });
}

startServer();
testDbConnection().catch((err) => console.log(err));

console.log('Server ready at port', process.env.SERVER_PORT);
