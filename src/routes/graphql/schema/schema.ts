import { GraphQLSchema } from 'graphql';
import { RootQueryType } from './rootQueryType.js';
import { RootMutationType } from './rootMutationType.js';

export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
