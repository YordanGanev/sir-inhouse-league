import Image from "next/image";
import Link from "next/link";

import Style from "./Home.module.css";

export default function Home() {
  return (
    <main className={`content-wrapper`}>
      <h1>SiR Inhouse league</h1>

      <p>Player profile is cooking..</p>

      <div className={Style.info}>
        <h3>Meanwhile check out: </h3>

        <ul className={Style.nav}>
          <li>
            <Link href={"/stats"}>Heroes picked stats</Link>
          </li>
          <li>
            <Link href={"/matches"}>Matches history and stats</Link>
          </li>
          <li>
            <Link href={"/players"}>Players stats</Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
