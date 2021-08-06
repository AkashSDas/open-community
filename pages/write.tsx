import { useRouter } from "next/router";
import { useState } from "react";

import AdminPostCard from "../components/post_cards/admin_post_card";
import CreateNewPostForm from "../components/write/create_new_post_form";
import { useUserData } from "../lib/hooks";
import { createNewPost } from "../lib/posts";
import { INewPost } from "../lib/posts/interfaces";

function Write() {
  const router = useRouter();
  const { user, username } = useUserData();

  const [redirect, setRedirect] = useState({
    doRedirect: false,
    postDocId: null,
  });

  const performRedirect = () => {
    if (redirect.doRedirect) {
      router.push({
        pathname: `/edit/${redirect.postDocId}`,
      });
    }
  };

  const onSubmit = async (values) => {
    const { postRef } = await createNewPost(values, user);

    setRedirect({
      doRedirect: true,
      postDocId: postRef.id,
    });
  };

  const initialFormValues: INewPost = {
    title: "",
  };

  return (
    <main>
      <section className="write-section">
        <CreateNewPostForm
          onSubmit={onSubmit}
          initialFormValues={initialFormValues}
        />
        {performRedirect()}
      </section>

      {user && username && <AdminPostCard />}
    </main>
  );
}

export default Write;
