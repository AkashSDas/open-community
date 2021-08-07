import { useEffect, useState } from "react";

import SunriseSVG from "../svg_icons/sunrise";

function Greeting() {
  const [greeting, setGreeting] = useState(null);

  useEffect(() => {
    if (new Date(Date.now()).getHours() < 18) setGreeting("Good morning");
  }, []);

  const iconJsx = () => {
    if (greeting) {
      return <SunriseSVG />;
    }
  };

  return (
    <section className="datetime-greeting">
      {iconJsx()} <h4 className="text">{greeting}</h4>
    </section>
  );
}

export default Greeting;
