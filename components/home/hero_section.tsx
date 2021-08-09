import { useMostHeartedPostDataOnce } from "../../lib/hooks/posts/most_hearted_post";
import BigPostCard from "../post_cards/big_post_card";
import ExploreTags from "./explore_tags";
import PromotionSection from "./promotion_section";

function HeroSection() {
  return (
    <section className="top-section">
      <BigPostCard hook={useMostHeartedPostDataOnce} />

      <aside className="aside">
        <ExploreTags />
        <PromotionSection />
      </aside>
    </section>
  );
}

export default HeroSection;
