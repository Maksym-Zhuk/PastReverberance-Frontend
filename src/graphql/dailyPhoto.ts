import { gql } from '@apollo/client';

export const GETDAILYPHOTO = gql`
  query getDailyPhotos {
    getDailyPhotos {
      id
      photoUrl
      note
      createdAt
    }
  }
`;

export const GETDAILYPHOTOBYID = gql`
  mutation getDailyPhotoByID($input: GetDailyPhotoById!) {
    getDailyPhotoByID(input: $input) {
      id
      photoUrl
      note
    }
  }
`;

export const UPDATEDAILYPHOTO = gql`
  mutation updateDailyPhoto($input: UpdateDailyPhotoInput!) {
    updateDailyPhoto(input: $input) {
      id
      photoUrl
      note
    }
  }
`;

export const DELETEDAILYPHOTO = gql`
  mutation deleteDailyPhoto($input: DeleteDailyPhotoInput!) {
    deleteDailyPhoto(input: $input)
  }
`;
