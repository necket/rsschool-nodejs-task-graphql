import { GraphQLObjectType } from 'graphql';
import { MemberTypeField, MemberTypesField } from '../types/memberType.js';
import { UserTypeField, UsersTypeField } from '../types/user.js';
import { ProfileTypeField, ProfilesTypeField } from '../types/profile.js';
import { PostTypeField, PostsTypeField } from '../types/post.js';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberType: MemberTypeField,
    memberTypes: MemberTypesField,
    user: UserTypeField,
    users: UsersTypeField,
    profile: ProfileTypeField,
    profiles: ProfilesTypeField,
    post: PostTypeField,
    posts: PostsTypeField,
  },
});
