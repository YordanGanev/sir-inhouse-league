import Link from "next/link";

import Style from "./Matches.module.css";
import Image from "next/image";
import { getPlaceholderImage, passTimeString } from "@/lib/common";
import Team from "@/components/team";
import { env } from "process";
import MatchesNav from "./matches-nav";

export const metadata = {
  title: "Matches",
  description: "Matches history",
};

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = searchParams.page;
  let searchOffset = 0;
  if (page) {
    searchOffset = parseInt(page) * 25;
  }
  const matches = await fetch(
    `https://open.faceit.com/data/v4/hubs/f21f2c66-d0c6-4d58-8146-3681ba8bd94a/matches?type=past&offset=${searchOffset}&limit=25`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${env.FACEIT_TOKEN}`,
      },
      next: { revalidate: 1800 },
    },
  ).then((res) => res.json());

  return (
    <main className={`content-wrapper `}>
      <div>
        <ul className={Style.matches}>
          {matches.items.map((match: any) => {
            return (
              <li
                key={match.match_id}
                className={`${Style.match} ${
                  match.status === "CANCELLED" ? Style.disabled : ""
                }`}
              >
                <Link href={`/matches/${match.match_id}`}>
                  <div className={Style.matchLink}>
                    <Team
                      hasWon={match.results?.winner === "faction1"}
                      isFirst={true}
                      team={match.teams.faction1}
                    />
                    <div className={Style.info}>
                      <div>
                        {passTimeString(new Date(match.finished_at * 1000))}
                      </div>
                      <div>
                        {match.status === "FINISHED" && <span>VS</span>}
                        {match.status === "CANCELLED" && "Dodged"}
                      </div>
                    </div>
                    <Team
                      hasWon={match.results?.winner === "faction2"}
                      isFirst={false}
                      team={match.teams.faction2}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <MatchesNav isEnd={matches.items.length != 25} />
    </main>
  );
}
