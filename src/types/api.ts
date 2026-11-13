export type DailyPhoto = {
  id: number;
  userId: number;
  photoUrl: string;
  note: string | null;
  date: string;
};

export type ProfileInfo = {
  id: number;
  firstName: string;
  lastName: string;
  description: string;
};

export type User = {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  profile: ProfileInfo | null;
};
