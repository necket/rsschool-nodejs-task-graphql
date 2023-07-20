import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../../types/uuid.js';
import { FastifyInstance } from 'fastify';
import { MemberTypeId, MemberTypeType } from './memberType.js';

// ProfileType
export const ProfileType = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    userId: {
      type: UUIDType,
    },
    memberTypeId: {
      type: MemberTypeId,
    },
    memberType: {
      type: MemberTypeType,
      resolve: postMemberTypeResolver,
    },
  }),
});

// ManyProfilesType
const ManyProfilesType = new GraphQLList(ProfileType);

// Profile args
interface ProfileTypeArgs {
  id: string;
}
const profileTypeArgs = { id: { type: UUIDType } };

// Profile resolver
const profileTypeResolver = (
  _parent,
  args: ProfileTypeArgs,
  { prisma }: FastifyInstance,
) => {
  return prisma.profile.findUnique({
    where: {
      id: args.id,
    },
  });
};

// Many Profiles resolver
const manyProfileTypeResolver = (_parent, _args, { prisma }: FastifyInstance) => {
  return prisma.profile.findMany();
};

// MemberType resolver
const postMemberTypeResolver = (
  parent: { memberTypeId: string },
  _args,
  { prisma }: FastifyInstance,
) => {
  return prisma.memberType.findUnique({ where: { id: parent.memberTypeId } });
};

// ProfileType Field
export const ProfileTypeField = {
  type: ProfileType,
  args: profileTypeArgs,
  resolve: profileTypeResolver,
};

// Many UserType Field
export const ProfilesTypeField = {
  type: ManyProfilesType,
  resolve: manyProfileTypeResolver,
};
