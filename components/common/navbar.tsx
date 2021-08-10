import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";

import { UserContext } from "../../lib/context";
import RoundedButton from "../buttons/rounded_btn";
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
  pathname: string;
  authNeeded: boolean;
  displayItem: boolean;

  constructor(
    icon: JSX.Element,
    text: string,
    pathname: string,
    authNeeded: boolean,
    displayItem: boolean = null
  ) {
    this.icon = icon;
    this.text = text;
    this.pathname = pathname;
    this.authNeeded = authNeeded;
    this.displayItem = displayItem;
  }
}

export function SideNavbar() {
  const { username } = useContext(UserContext);

  const section1: NavbarSectionItem[] = [
    new NavbarSectionItem(<HomeSVG />, "Home", "/", false),
    new NavbarSectionItem(<PresentationSVG />, "Trending", "/trending", false),
    new NavbarSectionItem(<MenuSVG />, "Topics", "/topics", false),
    new NavbarSectionItem(<SearchSVG />, "Search", "/search", false),
    new NavbarSectionItem(<EditSVG />, "Write", "/write", false),
    new NavbarSectionItem(<SavedSVG />, "Bookmark", "/bookmark", true, true),
  ];

  const section2: NavbarSectionItem[] = [
    new NavbarSectionItem(
      <UserSVG />,
      "Admin",
      `/admin/${username}`,
      true,
      true
    ),
    new NavbarSectionItem(<SettingsSVG />, "Settings", "/settings", true, true),
  ];

  const section3: NavbarSectionItem[] = [
    new NavbarSectionItem(<CupSVG />, "Earn", "/earn", false),
    new NavbarSectionItem(<ShoppingCartSVG />, "Upgrade", "/upgrade", false),
    new NavbarSectionItem(<UserPlusSVG />, "Login", "/login", true, false),
  ];

  const navSections: NavbarSectionItem[][] = [section1, section2, section3];

  const displayNavItem = (itemKey: number, navItem: NavbarSectionItem) => {
    if (!navItem.authNeeded)
      return (
        <NavItem key={itemKey}>
          <NavbarBtn
            icon={navItem.icon}
            text={navItem.text}
            pathname={navItem.pathname}
          />
        </NavItem>
      );

    if (navItem.displayItem && username) {
      return (
        <NavItem key={itemKey}>
          <NavbarBtn
            icon={navItem.icon}
            text={navItem.text}
            pathname={navItem.pathname}
          />
        </NavItem>
      );
    }

    if (!navItem.displayItem && !username) {
      return (
        <NavItem key={itemKey}>
          <NavbarBtn
            icon={navItem.icon}
            text={navItem.text}
            pathname={navItem.pathname}
          />
        </NavItem>
      );
    }

    return <></>;
  };

  const displayNavSection = (key: number, section: NavbarSectionItem[]) => {
    // user is not logged in then don't show 2nd (0+1) section
    if (key === 1 && username) {
      return (
        <NavSection key={key}>
          {section.map((navItem: NavbarSectionItem, itemKey: number) =>
            displayNavItem(itemKey, navItem)
          )}
        </NavSection>
      );
    }
    if (key !== 1) {
      return (
        <NavSection key={key}>
          {section.map((navItem: NavbarSectionItem, itemKey: number) =>
            displayNavItem(itemKey, navItem)
          )}
        </NavSection>
      );
    }

    return <></>;
  };

  return (
    <nav className="navbar">
      <NavSection>
        <NavItem>
          <LogoSection />
        </NavItem>
      </NavSection>

      {navSections.map((section: NavbarSectionItem[], key: number) =>
        displayNavSection(key, section)
      )}

      {username ? null : (
        <NavSection className="push-down">
          <RoundedButton onClick={() => {}} text="Sign Up" />
        </NavSection>
      )}
    </nav>
  );
}

function NavSection(props) {
  return <ul className={`navbar-nav ${props.className}`}>{props.children}</ul>;
}

function NavItem(props) {
  return <li className="nav-item">{props.children}</li>;
}

function NavbarBtn(props: {
  icon: JSX.Element;
  text: string;
  pathname: string;
}) {
  const router = useRouter();
  const checkPath = (path: string) => {
    if (router.pathname === path) return true;
    return false;
  };

  return (
    <Link href={props.pathname}>
      <button
        className={`navbar-btn${checkPath(props.pathname) ? "-active" : ""}`}
      >
        <span className={`icon`}>{props.icon}</span>
        <span className={`text`}>{props.text}</span>
      </button>
    </Link>
  );
}

function LogoSection() {
  return (
    <span className="logo-section">
      <LogoSVG />
    </span>
  );
}
