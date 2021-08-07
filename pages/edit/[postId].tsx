import { useRouter } from "next/router";
import React, { useState } from "react";

import PostEditForm from "../../components/edit/post_edit_form";
import { firestore, FirestoreDocumentData } from "../../lib/firebase";

export interface IPostState {
  post: FirestoreDocumentData;
  metadata: FirestoreDocumentData;
  content: FirestoreDocumentData;
}

function EditPost() {
  const router = useRouter();

  const [postState, setPostState] = useState<IPostState>({
    post: null,
    metadata: null,
    content: null,
  });

  (async () => {
    // getting all post data from postId in router query
    if (router.query?.postId) {
      const postDocRef = firestore.doc(`posts/${router.query.postId}`);
      const post = await postDocRef.get();

      const metadataDocRef = firestore.doc(`postMetadata/${postDocRef.id}`);
      const metadata = await metadataDocRef.get();

      const postContentRef = firestore.doc(`postContents/${postDocRef.id}`);
      const postContent = await postContentRef.get();

      setPostState({
        post: post,
        metadata: metadata,
        content: postContent,
      });
    }
  })();

  if (
    postState.content !== null &&
    postState.metadata !== null &&
    postState.post !== null
  ) {
    return <PostEditForm postState={postState} />;
  }

  return <main>Loading...</main>;
}

export default EditPost;
