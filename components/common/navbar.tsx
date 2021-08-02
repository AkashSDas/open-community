import CupSVG from "../svg_icons/cup";
import EditSVG from "../svg_icons/edit";
import HomeSVG from "../svg_icons/home";
import LogoSVG from "../svg_icons/logo";
import MenuSVG from "../svg_icons/menu";
import PresentationSVG from "../svg_icons/presentation";
import SavedSVG from "../svg_icons/saved";
import SearchSVG from "../svg_icons/search";
import SettingsSVG from "../svg_icons/settings";
import ShoppingCartSVG from "../svg_icons/shopping_cart";
import UserSVG from "../svg_icons/user";
import UserPlusSVG from "../svg_icons/user_plus";

class NavbarSectionItem {
  icon: JSX.Element;
  text: string;
  active: boolean;

  constructor(icon: JSX.Element, text: string, active: boolean) {
    this.icon = icon;
    this.text = text;
    this.active = active;
  }
}

export function SideNavbar() {
  const section1: NavbarSectionItem[] = [
    new NavbarSectionItem(<HomeSVG />, "Home", false),
    new NavbarSectionItem(<PresentationSVG />, "Trending", false),
    new NavbarSectionItem(<MenuSVG />, "Topics", false),
    new NavbarSectionItem(<SearchSVG />, "Search", false),
    new NavbarSectionItem(<EditSVG />, "Write", false),
    new NavbarSectionItem(<SavedSVG />, "Bookmark", false),
  ];

  const section2: NavbarSectionItem[] = [
    new NavbarSectionItem(<UserSVG />, "Admin", false),
    new NavbarSectionItem(<SettingsSVG />, "Settings", false),
  ];

  const section3: NavbarSectionItem[] = [
    new NavbarSectionItem(<CupSVG />, "Earn", false),
    new NavbarSectionItem(<ShoppingCartSVG />, "Upgrade", false),
    new NavbarSectionItem(<UserPlusSVG />, "Login", false),
  ];

  return (
    <nav className="navbar">
      <NavSection>
        <NavItem>
          <LogoSection />
        </NavItem>
      </NavSection>
      <NavSection>
        {section1.map((value: NavbarSectionItem, key: number) => (
          <NavItem key={key}>
            <NavbarBtn
              icon={value.icon}
              text={value.text}
              active={value.active}
            />
          </NavItem>
        ))}
      </NavSection>
      <NavSection>
        {section2.map((value: NavbarSectionItem, key: number) => (
          <NavItem key={key}>
            <NavbarBtn
              icon={value.icon}
              text={value.text}
              active={value.active}
            />
          </NavItem>
        ))}
      </NavSection>
      <NavSection>
        {section3.map((value: NavbarSectionItem, key: number) => (
          <NavItem key={key}>
            <NavbarBtn
              icon={value.icon}
              text={value.text}
              active={value.active}
            />
          </NavItem>
        ))}
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
