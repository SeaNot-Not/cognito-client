export interface BasicUser {
  _id: string;
  name: string;
  age?: number;
  bio?: string;
  profilePicture?: string;
}

export interface MatchItem {
  _id: string;
  userA: BasicUser | string;
  userB: BasicUser | string;
  unmatched: boolean;
  createdAt?: string;
  updatedAt?: string;
}


