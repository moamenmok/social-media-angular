export interface IProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  cover: string;
  bookmarks: any[];
  followers: any[];
  following: string[];
  createdAt: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}
