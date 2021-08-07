import Greeting from "../components/common/greeting";
import BigPostWithMostHeartsCard from "../components/home/big_post_with_most_hearts_card";
import LogoSVG from "../components/svg_icons/logo";

function Index() {
  return (
    <main className="home">
      <Greeting />
      <HomePageTopSection />
      <hr />
    </main>
  );
}

function HomePageTopSection() {
  return (
    <section className="top-section">
      <BigPostWithMostHeartsCard />

      <aside className="aside">
        <div className="explore">
          <div className="heading">Explore your taste</div>

          <div className="tag-btns">
            <TagButton text="accounting" />
            <TagButton text="stock-market" />
            <TagButton text="ipo" />
            <TagButton text="finance" />
            <TagButton text="web-dev" />
            <TagButton text="cloud-computing" />
            <TagButton text="sports" />
            <TagButton text="nutrition" />
            <TagButton text="health" />
          </div>

          <div className="see-more">See more topics!</div>
        </div>

        <div className="promotion">
          <div className="info">
            <h4>Teaching is to learn twice</h4>
            <div className="tag-line">
              Start writing today and Shape the future
            </div>
            <button>Start writing</button>
          </div>

          <div className="mask"></div>

          <img
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
            alt=""
          />

          <LogoSVG />
        </div>
      </aside>
    </section>
  );
}

function TagButton(props: { text: string }) {
  return <button className="tag-btn">#{props.text}</button>;
}

export default Index;
