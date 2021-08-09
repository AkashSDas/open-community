import { useRouter } from "next/dist/client/router";

import LogoSVG from "../svg_icons/logo";

function PromotionSection() {
  const router = useRouter();
  const handleClick = () => router.push("/write");

  const infoJsx = () => (
    <div className="info">
      <h4>Teaching is to learn twice</h4>
      <div>Start writing today and shape the future</div>
      <button onClick={handleClick}>Start writing</button>
    </div>
  );

  const maskJsx = () => <div className="mask"></div>;

  const bgJsx = () => (
    <>
      <img
        src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
        alt=""
      />

      <LogoSVG />
    </>
  );

  return (
    <section className="promotion">
      {infoJsx()}
      {maskJsx()}
      {bgJsx()}
    </section>
  );
}

export default PromotionSection;
