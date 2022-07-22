export interface ISubCategory {
  _id?: string;
  code?: number;
  title: string;
  parentId: number;
  url: string;
  // sub_subcategory?: [];
  logo?: string;
}
