import { FirebaseUser, firestore, serverTimestamp } from "../firebase";
import { INewPost, IPostContentsDoc, IPostMetadataDoc, IPostsDoc, IUpdatePost } from "./interfaces";

export async function createNewPost(values: INewPost, user: FirebaseUser) {
  // Commit both docs together as a batch write.
  const batch = firestore.batch();

  // Post doc
  const postRef = firestore.collection("/posts").doc();
  const postData: IPostsDoc = {
    authorId: user.uid,
    title: values.title,
    description: "",
    coverImgURL: "",
    createdAt: serverTimestamp(),
    lastmodifiedAt: serverTimestamp(),
    publish: false,
  };
  batch.set(postRef, postData);

  // metadata and content doc for a post will have same id as
  // the post

  // Post metadata doc
  const metadataRef = firestore.doc(`/postMetadata/${postRef.id}`);
  const metadataData: IPostMetadataDoc = {
    tags: [],
    numOfWords: 0,
    readTime: 0,
    views: 0,
    hearts: 0,
  };
  batch.set(metadataRef, metadataData);

  // Post content doc
  const postContentRef = firestore.doc(`/postContents/${postRef.id}`);
  const postContentData: IPostContentsDoc = {
    content: "",
  };
  batch.set(postContentRef, postContentData);

  await batch.commit();

  return { postRef };
}

export async function updatePost(values: IUpdatePost) {
  const { postId, metadataId, contentId } = values;
  const { post, metadata, content } = values;

  const batch = firestore.batch();

  const postRef = firestore.doc(`posts/${postId}`);
  const metadataRef = firestore.doc(`postMetadata/${metadataId}`);
  const contentRef = firestore.doc(`postContents/${contentId}`);

  batch.update(postRef, {
    coverImgURL: post.coverImgURL,
    title: post.title,
    description: post.description,
    publish: post.publish,
    lastmodifiedAt: serverTimestamp(),
  });

  batch.update(metadataRef, {
    numOfWords: metadata.numOfWords,
    readTime: metadata.readTime,
    tags: metadata.tags,
  });

  batch.update(contentRef, {
    content: content.content,
  });

  await batch.commit();
}
