import {
  FirebaseUser,
  FirestoreFieldValue,
  FirestoreTimestamp,
} from "../firebase";

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
  metadataId: string; // post metadata doc id
  postContentId: string; // post content doc id
}

// values that are needed while creating new post
export interface INewPost {
  title: string;
}
