function ExploreTags() {
  const tagJsx = (tag: string) => <button className="tag">#{tag}</button>;

  return (
    <section className="explore-tags">
      <div className="heading">Explore your taste</div>

      <div className="tags">
        {tagJsx("accounting")}
        {tagJsx("stock-market")}
        {tagJsx("sports")}
        {tagJsx("lifestyle")}
        {tagJsx("programming")}
        {tagJsx("finance")}
        {tagJsx("history")}
        {tagJsx("business")}
      </div>

      <div className="link">See more topics!</div>
    </section>
  );
}

export default ExploreTags;
