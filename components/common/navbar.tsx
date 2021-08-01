import HomeSVG from "../svg_icons/home";
import LogoSVG from "../svg_icons/logo";

export function SideNavbar() {
  return (
    <nav className="navbar">
      <NavSection>
        <NavItem>
          <LogoSection />
        </NavItem>
      </NavSection>
      <NavSection>
        <NavItem>
          <NavbarBtn icon={<HomeSVG />} text="Home" active={false} />
          <NavbarBtn icon={<HomeSVG />} text="Home" active={true} />
        </NavItem>
      </NavSection>
    </nav>
  );
}

function NavSection(props) {
  return <ul className="navbar-nav">{props.children}</ul>;
}

function NavItem(props) {
  return <li className="nav-item">{props.children}</li>;
}

function NavbarBtn(props: {
  icon: JSX.Element;
  text: string;
  active: boolean;
}) {
  return (
    <button className={`navbar-btn${props.active ? "-active" : ""}`}>
      <span className={`icon`}>{props.icon}</span>
      <span className={`text`}>{props.text}</span>
    </button>
  );
}

function LogoSection() {
  return (
    <span className="logo-section">
      <LogoSVG />
    </span>
  );
}
