import Style from "./styles/HeaderBar.module.css";
import Link from "next/link";
import Image from "next/image";

export default function HeadBar({ user }: { user?: any }) {
  return (
    <header className={Style.header}>
      <div className={Style.wrapper}>
        <div className={Style.icon}>
          <Link href="/">
            <Image width="40" height="40" src="/icon.png" alt="upkeep_icon" />
          </Link>
        </div>

        <ul className={Style.loginGroup}>
          <li>
            <Link href="/">Stats</Link>
          </li>
          <li>
            <Link href="/matches">Matches</Link>
          </li>
          <li>
            <Link href="/players">Players</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
