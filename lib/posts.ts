import {
  auth,
  firestore,
  FirestoreFieldValue,
  FirestoreTimestamp,
  serverTimestamp,
} from "./firebase";

interface IPostMetadataDoc {
  tags: string[];
  numOfWords: number;
  readTime: number;
  hearts: number;
  views: number;
}

interface IPostContentsDoc {
  content: string;
}

interface IPostsDoc {
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
interface INewPostValues {
  title: string;
}

export async function createNewPost(values: INewPostValues) {
  // Commit both docs together as a batch write.
  const batch = firestore.batch();

  // Post metadata doc
  const metadataRef = firestore.collection("postMetadata").doc();
  const metadataData: IPostMetadataDoc = {
    tags: [],
    numOfWords: 0,
    readTime: 0,
    views: 0,
    hearts: 0,
  };
  batch.set(metadataRef, metadataData);

  // Post content doc
  const postContentRef = firestore.collection("postContents").doc();
  const postContentData: IPostContentsDoc = {
    content: "",
  };
  batch.set(postContentRef, postContentData);

  // Post doc
  const postRef = firestore.collection("posts").doc();
  const postData: IPostsDoc = {
    authorId: auth.currentUser.uid,
    title: values.title,
    description: "",
    coverImgURL: "",
    createdAt: serverTimestamp(),
    lastmodifiedAt: serverTimestamp(),
    publish: false,
    metadataId: metadataRef.id,
    postContentId: postContentRef.id,
  };
  batch.set(postRef, postData);

  await batch.commit();

  return { postRef };
}

export {};
