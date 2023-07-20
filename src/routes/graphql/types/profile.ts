import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
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

// Mutations

// Create Profile
const createProfileDto = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: {
      type: new GraphQLNonNull(MemberTypeId),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});

const createProfileArgs = {
  dto: {
    type: new GraphQLNonNull(createProfileDto),
  },
};

interface CreateProfileArgs {
  dto: {
    userId: string;
    memberTypeId: string;
    isMale: boolean;
    yearOfBirth: number;
  };
}

const createProfileResolver = (
  _parent,
  args: CreateProfileArgs,
  fastify: FastifyInstance,
) => {
  return fastify.prisma.profile.create({
    data: args.dto,
  });
};

export const CreateProfileField = {
  type: ProfileType,
  args: createProfileArgs,
  resolve: createProfileResolver,
};

// Delete Profile

const deleteProfileArgs = {
  id: {
    type: new GraphQLNonNull(UUIDType),
  },
};

interface DeleteProfileArgs {
  id: string;
}

const deleteProfileResolver = async (
  _parent,
  args: DeleteProfileArgs,
  fastify: FastifyInstance,
) => {
  await fastify.prisma.profile.delete({
    where: {
      id: args.id,
    },
  });
};

export const DeleteProfileField = {
  type: GraphQLBoolean,
  args: deleteProfileArgs,
  resolve: deleteProfileResolver,
};

// Update Profile
const changeProfileDto = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: {
      type: MemberTypeId,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
  }),
});

const changeProfileArgs = {
  id: {
    type: new GraphQLNonNull(UUIDType),
  },
  dto: {
    type: new GraphQLNonNull(changeProfileDto),
  },
};

interface ChangeProfileArgs {
  id: string;
  dto: {
    memberTypeId: string;
    isMale: boolean;
    yearOfBirth: number;
  };
}

const changeProfileResolver = (
  _parent,
  args: ChangeProfileArgs,
  fastify: FastifyInstance,
) => {
  return fastify.prisma.profile.update({
    where: { id: args.id },
    data: args.dto,
  });
};

export const ChangeProfileField = {
  type: ProfileType,
  args: changeProfileArgs,
  resolve: changeProfileResolver,
};
