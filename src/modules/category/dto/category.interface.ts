export interface ICategory {
  _id?: string;
  code?: number;
  title: string;
  parentId: number;
  url: string;
  subcategory: [];
  logo?: string;
}
