export interface IFile {
  mime: string;
  affiliation: string;
  ownerId?: string;
  files?: [string];
  file?: string;
}
