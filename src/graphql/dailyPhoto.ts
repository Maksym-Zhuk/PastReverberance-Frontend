import { gql } from '@apollo/client';

export const GETDAILYPHOTO = gql`
  query getDailyPhotos {
    getDailyPhotos {
      id
      photoUrl
      note
      date
    }
  }
`;

export const GETDAILYPHOTOBYID = gql`
  mutation getDailyPhotoByID($input: getDailyPhotoByID!) {
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
