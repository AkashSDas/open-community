import { useRouter } from "next/router";

import Divider from "../components/common/divider";
import HeadingWithIcon from "../components/common/heading_with_icon";
import SizedBox from "../components/common/sized_box";
import SettingsSVG from "../components/svg_icons/settings";
import { auth } from "../lib/firebase";

function Settings() {
  const router = useRouter();

  return (
    <main>
      <HeadingWithIcon icon={<SettingsSVG />} text="Settings" />

      <SizedBox height="1rem" />
      <Divider />
      <SizedBox height="1rem" />

      <SettingsSection heading="Account">
        <button
          className="btn"
          onClick={async () => {
            await auth.signOut();
            router.push("/");
            // router.reload();
          }}
        >
          Logout
        </button>
      </SettingsSection>
    </main>
  );
}

function SettingsSection({
  heading,
  children,
}: {
  heading: string;
  children: JSX.Element;
}) {
  return (
    <section className="settings-section">
      <div className="heading">{heading}</div>
      <SizedBox height="1rem" />
      {children}
    </section>
  );
}

export default Settings;
