import Style from "./styles/HeaderBar.module.css";
import Link from "next/link";
import Image from "next/image";
import NavLink from "./NavLink";
import { NavOptions } from "@/lib/common";

export default function HeadBar({ user }: { user?: any }) {
  return (
    <header className={Style.header}>
      <div className={Style.wrapper}>
        <div className={Style.icon}>
          <Link href="/">
            <div>
              <Image width="40" height="40" src="/icon.png" alt="upkeep_icon" />
            </div>
          </Link>
        </div>

        <ul className={Style.loginGroup}>
          <li>
            <Link href="/seasons">Seasons</Link>
          </li>
          <li>
            <Link href="/matches">Matches</Link>
          </li>
          {NavOptions.map((li: any) => {
            return (
              <li key={li.value}>
                <NavLink slug={li.value}>{li.label}</NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
