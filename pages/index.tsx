import Divider from "../components/common/divider";
import Greeting from "../components/common/greeting";
import SizedBox from "../components/common/sized_box";
import AuthorsToFollow from "../components/home/authors_to_follow";
import HeroSection from "../components/home/hero_section";
import PostListView from "../components/home/post_listview";
import SmallPostCardtListView from "../components/home/small_post_card_listview";
import TrendingSection from "../components/home/trending_section";

function Index() {
  const space = () => (
    <>
      <SizedBox height="2rem" />
      <Divider />
      <SizedBox height="2rem" />
    </>
  );

  return (
    <main className="home">
      <Greeting />
      <HeroSection />
      {space()}
      <TrendingSection />
      {space()}
      <div className="postlist-and-aside">
        <PostListView />
        <AsideSection />
      </div>
    </main>
  );
}

function AsideSection() {
  return (
    <aside>
      <AuthorsToFollow />
      <Divider />
      <SmallPostCardtListView />
    </aside>
  );
}

export default Index;
