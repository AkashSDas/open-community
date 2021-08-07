import { FirestoreFieldValue, FirestoreTimestamp } from "../firebase";

export interface IPostMetadataDoc {
  tags: string[];
  numOfWords: number;
  readTime: number;
  hearts: number;
  views: number;
}

export interface IPostContentsDoc {
  content: string;
}

export interface IPostsDoc {
  authorId: string;
  title: string;
  description: string;
  coverImgURL: string;
  createdAt: number | FirestoreTimestamp | FirestoreFieldValue;
  lastmodifiedAt: number | FirestoreTimestamp | FirestoreFieldValue;
  publish: boolean;
}

// values that are needed while creating new post
export interface INewPost {
  title: string;
}

// post doc shape while author is updating the post
export interface IPostsAuthorUpdateDoc {
  title: string;
  description: string;
  coverImgURL: string;
  lastmodifiedAt: number | FirestoreTimestamp | FirestoreFieldValue;
  publish: boolean;
}

// post metadata author update
export interface IPostMetadataAuthorUpdateDoc {
  tags: string[];
  numOfWords: number;
  readTime: number;
}

// update post
export interface IUpdatePost {
  postId: string;
  metadataId?: string;
  contentId?: string;

  post: IPostsAuthorUpdateDoc;
  metadata: IPostMetadataAuthorUpdateDoc;
  content: IPostContentsDoc;
}
