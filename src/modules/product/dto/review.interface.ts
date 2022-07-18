export interface IReview {
  _id: string;
  comment?: string;
  rating?: number;
  userID?: string;
  createdAt: Date;
}
