import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateProfileInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
};

export type DailyPhoto = {
  __typename?: 'DailyPhoto';
  date: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  note?: Maybe<Scalars['String']['output']>;
  photoUrl: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

export type DeleteDailyPhotoInput = {
  id: Scalars['Int']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteDailyPhoto: Scalars['String']['output'];
  getDailyPhotoByID: DailyPhoto;
  login: User;
  refreshToken: RefreshResponse;
  register: User;
  updataUser: UpdateUserResponse;
  updateDailyPhoto: DailyPhoto;
};


export type MutationDeleteDailyPhotoArgs = {
  input: DeleteDailyPhotoInput;
};


export type MutationGetDailyPhotoByIdArgs = {
  input: GetDailyPhotoById;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationUpdataUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateDailyPhotoArgs = {
  input: UpdateDailyPhotoInput;
};

export type ProfileInfo = {
  __typename?: 'ProfileInfo';
  description: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  delete: Scalars['String']['output'];
  getDailyPhotos: Array<DailyPhoto>;
  logout: Scalars['String']['output'];
  me: User;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  profile: CreateProfileInput;
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type UpdateDailyPhotoInput = {
  date: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  note: Scalars['String']['input'];
};

export type UpdateUserInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserResponse = {
  __typename?: 'UpdateUserResponse';
  profile?: Maybe<ProfileInfo>;
  user?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  dailyPhotos: Array<DailyPhoto>;
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  password: Scalars['String']['output'];
  profile?: Maybe<ProfileInfo>;
  role: Role;
};

export type GetDailyPhotoById = {
  id: Scalars['Int']['input'];
};

export type RefreshResponse = {
  __typename?: 'refreshResponse';
  accessToken: Scalars['String']['output'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'User', id: number } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'User', id: number } };

export type GetDailyPhotosQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDailyPhotosQuery = { __typename?: 'Query', getDailyPhotos: Array<{ __typename?: 'DailyPhoto', id: number, photoUrl: string, note?: string | null, date: string }> };

export type GetDailyPhotoByIdMutationVariables = Exact<{
  input: GetDailyPhotoById;
}>;


export type GetDailyPhotoByIdMutation = { __typename?: 'Mutation', getDailyPhotoByID: { __typename?: 'DailyPhoto', id: number, photoUrl: string, note?: string | null } };

export type UpdateDailyPhotoMutationVariables = Exact<{
  input: UpdateDailyPhotoInput;
}>;


export type UpdateDailyPhotoMutation = { __typename?: 'Mutation', updateDailyPhoto: { __typename?: 'DailyPhoto', id: number, photoUrl: string, note?: string | null } };

export type DeleteDailyPhotoMutationVariables = Exact<{
  input: DeleteDailyPhotoInput;
}>;


export type DeleteDailyPhotoMutation = { __typename?: 'Mutation', deleteDailyPhoto: string };


export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    id
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const GetDailyPhotosDocument = gql`
    query getDailyPhotos {
  getDailyPhotos {
    id
    photoUrl
    note
    date
  }
}
    `;

/**
 * __useGetDailyPhotosQuery__
 *
 * To run a query within a React component, call `useGetDailyPhotosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDailyPhotosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDailyPhotosQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDailyPhotosQuery(baseOptions?: Apollo.QueryHookOptions<GetDailyPhotosQuery, GetDailyPhotosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDailyPhotosQuery, GetDailyPhotosQueryVariables>(GetDailyPhotosDocument, options);
      }
export function useGetDailyPhotosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDailyPhotosQuery, GetDailyPhotosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDailyPhotosQuery, GetDailyPhotosQueryVariables>(GetDailyPhotosDocument, options);
        }
export function useGetDailyPhotosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDailyPhotosQuery, GetDailyPhotosQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDailyPhotosQuery, GetDailyPhotosQueryVariables>(GetDailyPhotosDocument, options);
        }
export type GetDailyPhotosQueryHookResult = ReturnType<typeof useGetDailyPhotosQuery>;
export type GetDailyPhotosLazyQueryHookResult = ReturnType<typeof useGetDailyPhotosLazyQuery>;
export type GetDailyPhotosSuspenseQueryHookResult = ReturnType<typeof useGetDailyPhotosSuspenseQuery>;
export type GetDailyPhotosQueryResult = Apollo.QueryResult<GetDailyPhotosQuery, GetDailyPhotosQueryVariables>;
export const GetDailyPhotoByIdDocument = gql`
    mutation getDailyPhotoByID($input: getDailyPhotoByID!) {
  getDailyPhotoByID(input: $input) {
    id
    photoUrl
    note
  }
}
    `;
export type GetDailyPhotoByIdMutationFn = Apollo.MutationFunction<GetDailyPhotoByIdMutation, GetDailyPhotoByIdMutationVariables>;

/**
 * __useGetDailyPhotoByIdMutation__
 *
 * To run a mutation, you first call `useGetDailyPhotoByIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetDailyPhotoByIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getDailyPhotoByIdMutation, { data, loading, error }] = useGetDailyPhotoByIdMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetDailyPhotoByIdMutation(baseOptions?: Apollo.MutationHookOptions<GetDailyPhotoByIdMutation, GetDailyPhotoByIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetDailyPhotoByIdMutation, GetDailyPhotoByIdMutationVariables>(GetDailyPhotoByIdDocument, options);
      }
export type GetDailyPhotoByIdMutationHookResult = ReturnType<typeof useGetDailyPhotoByIdMutation>;
export type GetDailyPhotoByIdMutationResult = Apollo.MutationResult<GetDailyPhotoByIdMutation>;
export type GetDailyPhotoByIdMutationOptions = Apollo.BaseMutationOptions<GetDailyPhotoByIdMutation, GetDailyPhotoByIdMutationVariables>;
export const UpdateDailyPhotoDocument = gql`
    mutation updateDailyPhoto($input: UpdateDailyPhotoInput!) {
  updateDailyPhoto(input: $input) {
    id
    photoUrl
    note
  }
}
    `;
export type UpdateDailyPhotoMutationFn = Apollo.MutationFunction<UpdateDailyPhotoMutation, UpdateDailyPhotoMutationVariables>;

/**
 * __useUpdateDailyPhotoMutation__
 *
 * To run a mutation, you first call `useUpdateDailyPhotoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDailyPhotoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDailyPhotoMutation, { data, loading, error }] = useUpdateDailyPhotoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDailyPhotoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDailyPhotoMutation, UpdateDailyPhotoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDailyPhotoMutation, UpdateDailyPhotoMutationVariables>(UpdateDailyPhotoDocument, options);
      }
export type UpdateDailyPhotoMutationHookResult = ReturnType<typeof useUpdateDailyPhotoMutation>;
export type UpdateDailyPhotoMutationResult = Apollo.MutationResult<UpdateDailyPhotoMutation>;
export type UpdateDailyPhotoMutationOptions = Apollo.BaseMutationOptions<UpdateDailyPhotoMutation, UpdateDailyPhotoMutationVariables>;
export const DeleteDailyPhotoDocument = gql`
    mutation deleteDailyPhoto($input: DeleteDailyPhotoInput!) {
  deleteDailyPhoto(input: $input)
}
    `;
export type DeleteDailyPhotoMutationFn = Apollo.MutationFunction<DeleteDailyPhotoMutation, DeleteDailyPhotoMutationVariables>;

/**
 * __useDeleteDailyPhotoMutation__
 *
 * To run a mutation, you first call `useDeleteDailyPhotoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDailyPhotoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDailyPhotoMutation, { data, loading, error }] = useDeleteDailyPhotoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteDailyPhotoMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDailyPhotoMutation, DeleteDailyPhotoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDailyPhotoMutation, DeleteDailyPhotoMutationVariables>(DeleteDailyPhotoDocument, options);
      }
export type DeleteDailyPhotoMutationHookResult = ReturnType<typeof useDeleteDailyPhotoMutation>;
export type DeleteDailyPhotoMutationResult = Apollo.MutationResult<DeleteDailyPhotoMutation>;
export type DeleteDailyPhotoMutationOptions = Apollo.BaseMutationOptions<DeleteDailyPhotoMutation, DeleteDailyPhotoMutationVariables>;