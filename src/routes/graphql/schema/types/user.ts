import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { FastifyInstance } from 'fastify';
import { ProfileType } from './profile.js';
import { ManyPostsType } from './post.js';

// UserType
export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: subscribedToUserResolver,
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: userSubscribedToResolver,
    },
    profile: {
      type: ProfileType,
      resolve: userProfileResolver,
    },
    posts: {
      type: ManyPostsType,
      resolve: userPostResolver,
    },
  }),
});

// ManyUsersType
const ManyUsersType = new GraphQLList(UserType);

// User args
interface UserTypeArgs {
  id: string;
}
const userTypeArgs = { id: { type: UUIDType } };

// User resolver
const userTypeResolver = (_parent, args: UserTypeArgs, { prisma }: FastifyInstance) => {
  return prisma.user.findUnique({
    where: {
      id: args.id,
    },
  });
};

// Many Users resolver
const manyUserTypesResolver = (_parent, _args, { prisma }: FastifyInstance) => {
  return prisma.user.findMany();
};

// subscribedToUser resolver
const subscribedToUserResolver = (
  parent: { id: string },
  _args,
  { prisma }: FastifyInstance,
) => {
  return prisma.user.findMany({
    where: {
      userSubscribedTo: {
        some: {
          authorId: parent.id,
        },
      },
    },
  });
};

// userSubscribedTo resolver
const userSubscribedToResolver = (
  parent: { id: string },
  _args,
  { prisma }: FastifyInstance,
) => {
  return prisma.user.findMany({
    where: {
      subscribedToUser: {
        some: {
          subscriberId: parent.id,
        },
      },
    },
  });
};

// Profile resolver
const userProfileResolver = (
  parent: { id: string },
  _args,
  { prisma }: FastifyInstance,
) => {
  return prisma.profile.findUnique({ where: { userId: parent.id } });
};

// Post Resolver
const userPostResolver = (parent: { id: string }, _args, { prisma }: FastifyInstance) => {
  return prisma.post.findMany({ where: { authorId: parent.id } });
};

// UserType Field
export const UserTypeField = {
  type: UserType,
  args: userTypeArgs,
  resolve: userTypeResolver,
};

// Many UserType Field
export const UsersTypeField = {
  type: ManyUsersType,
  resolve: manyUserTypesResolver,
};

// Mutations

// Create User
const createUserDto = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  }),
});

const createUserArgs = {
  dto: {
    type: new GraphQLNonNull(createUserDto),
  },
};

interface CreateUserArgs {
  dto: {
    name: string;
    balance: number;
  };
}

const createUserResolver = (_parent, args: CreateUserArgs, fastify: FastifyInstance) => {
  return fastify.prisma.user.create({
    data: args.dto,
  });
};

export const CreateUserField = {
  type: UserType,
  args: createUserArgs,
  resolve: createUserResolver,
};
