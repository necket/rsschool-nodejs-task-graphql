import { FastifyInstance } from 'fastify';
import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLList,
} from 'graphql';

// MemberTypeId Enum
export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});

// MemberType Type
export const MemberTypeType: GraphQLObjectType = new GraphQLObjectType({
  name: 'memberType',
  fields: () => ({
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

// Many MemberTypes Type
const ManyMemberTypesType = new GraphQLList(MemberTypeType);

// MemberType Args
interface MemberTypeArgs {
  id: string;
}

const memberTypeArgs = {
  id: { type: MemberTypeId },
};

// MemberType Resolver
const memberTypeResolver = (
  _parent,
  args: MemberTypeArgs,
  { prisma }: FastifyInstance,
) => {
  return prisma.memberType.findUnique({
    where: {
      id: args.id,
    },
  });
};

// Many MemberTypes Resolver
const manyMemberTypesResolver = (_parent, _args, { prisma }: FastifyInstance) => {
  return prisma.memberType.findMany();
};

// MemberType Field
export const MemberTypeField = {
  type: MemberTypeType,
  args: memberTypeArgs,
  resolve: memberTypeResolver,
};

// Many MemberTypes Field
export const MemberTypesField = {
  type: ManyMemberTypesType,
  resolve: manyMemberTypesResolver,
};
