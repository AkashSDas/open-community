import { Formik } from "formik";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { auth, firestore, serverTimestamp } from "../lib/firebase";

export interface IPost {
  title: string;
  description: string;
  coverImageURL: string;
  content: string;
}

export interface IPostMetadataThatAuthorCanSet {
  numOfWords: number;
  readTime: number;
}

function Write() {
  const [redirect, setRedirect] = useState({
    doRedirect: false,
    postDocId: null,
  });
  const router = useRouter();

  const performRedirect = () => {
    if (redirect.doRedirect) {
      router.push({ pathname: "/edit", query: { postId: redirect.postDocId } });
    }
  };

  const onSubmit = async (values) => {
    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    const authorId = auth.currentUser.uid;

    const metadataDoc = firestore.collection("postMetadata").doc();
    const metadataData = {
      createdAt: serverTimestamp(),
      lastmodifiedAt: serverTimestamp(),
      hearts: 0,
      numOfWords: 0,
      readTime: 0,
      tags: [],
      views: 0,
    };
    batch.set(metadataDoc, metadataData);

    const postContentDoc = firestore.collection("postContents").doc();
    const postContentData = {
      content: "",
    };
    batch.set(postContentDoc, postContentData);

    const postDoc = firestore.collection("posts").doc();
    const postData = {
      authorId,
      coverImgURL: "",
      title: values.title,
      description: "",
      metadataId: metadataDoc.id,
      postContentId: postContentDoc.id,
      publish: false,
    };
    batch.set(postDoc, postData);

    await batch.commit();

    setRedirect({
      doRedirect: true,
      postDocId: postDoc.id,
    });
  };

  const initialFormValues: { title: string } = {
    title: "",
  };

  return (
    <main>
      <section>
        <Formik initialValues={initialFormValues} onSubmit={onSubmit}>
          {({ values, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="Enter title for your post"
              />

              <button type="submit">Choose</button>
            </form>
          )}
        </Formik>
        {performRedirect()}
      </section>
    </main>
  );
}

export default Write;

/// WriteManager (just for creating new post) ///

// function WriteManager() {
//   const [tags, setTags] = useState<string[]>([]);
//   const [publish, setPublish] = useState(false);
//   const [postMetadata, setPostMetadata] =
//     useState<IPostMetadataThatAuthorCanSet>(null);

//   const onSubmit = (values: IPost) => {
//     // Commit both docs together as a batch write.
//     const batch = firestore.batch();
//     const authorId = auth.currentUser.uid;

//     const metadataDoc = firestore.collection("postMetadata").doc();
//     const metadataData = {
//       createdAt: serverTimestamp(),
//       lastmodifiedAt: serverTimestamp(),
//       hearts: 0,
//       numOfWords: postMetadata.numOfWords,
//       readTime: postMetadata.readTime,
//       tags: tags,
//       views: 0,
//     };
//     batch.set(metadataDoc, metadataData);

//     const postContentDoc = firestore.collection("postContents").doc();
//     const postContentData = {
//       content: values.content,
//     };
//     batch.set(postContentDoc, postContentData);

//     const postDoc = firestore.collection("posts").doc();
//     const postData = {
//       authorId,
//       coverImgURL: values.coverImageURL,
//       title: values.title,
//       description: values.description,
//       metadataId: metadataDoc.id,
//       postContentId: postContentDoc.id,
//     };
//     batch.set(postDoc, postData);

//     batch.commit();
//   };

//   const initialFormValues: IPost = {
//     title: "",
//     description: "",
//     coverImageURL: "",
//     content: "",
//   };

//   return (
//     <main>
//       <section className="write-section">
//         <Formik onSubmit={onSubmit} initialValues={initialFormValues}>
//           {({ values, handleSubmit, handleChange }) => (
//             <PostForm
//               values={values}
//               handleSubmit={handleSubmit}
//               handleChange={handleChange}
//               tags={tags}
//               setTags={setTags}
//               publish={publish}
//               setPublish={setPublish}
//               postMetadata={postMetadata}
//               setPostMetadata={setPostMetadata}
//             />
//           )}
//         </Formik>
//       </section>
//     </main>
//   );
// }
