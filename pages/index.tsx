import Greeting from "../components/common/greeting";
import { firestore } from "../lib/firebase";

function Index() {
  return (
    <main>
      <Greeting />
    </main>
  );
}

function getMostHeartedAndViewedPost() {
  const query = firestore.collection("posts").orderBy("");
}

export default Index;
