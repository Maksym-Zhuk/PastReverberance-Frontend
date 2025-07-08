import { gql } from '@apollo/client';

export const CREATEDAILYPHOTO = gql`
  mutation createDailyPhoto($input: CreateDailyPhotoInput!) {
    createDailyPhoto(input: $input) {
      id
    }
  }
`;
