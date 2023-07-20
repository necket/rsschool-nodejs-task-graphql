import { GraphQLObjectType } from 'graphql';
import { ChangePostField, CreatePostField, DeletePostField } from '../types/post.js';
import {
  ChangeUserField,
  CreateUserField,
  DeleteUserField,
  SubscribeToField,
  UnsubscribeFromField,
} from '../types/user.js';
import {
  ChangeProfileField,
  CreateProfileField,
  DeleteProfileField,
} from '../types/profile.js';

export const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createPost: CreatePostField,
    createUser: CreateUserField,
    createProfile: CreateProfileField,
    deletePost: DeletePostField,
    deleteUser: DeleteUserField,
    deleteProfile: DeleteProfileField,
    changeUser: ChangeUserField,
    changePost: ChangePostField,
    changeProfile: ChangeProfileField,
    subscribeTo: SubscribeToField,
    unsubscribeFrom: UnsubscribeFromField,
  },
});
