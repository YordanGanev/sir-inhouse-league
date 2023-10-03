import DotaTeam from "@/components/dota-team";
import { env } from "process";
import React from "react";

import Image from "next/image";

import Style from "./Match.module.css";
import NotFount from "@/styles/not-found.module.css";

export default async function MatchPage({
  params,
}: {
  params: { id: string };
}) {
  const match = await fetch(
    `https://open.faceit.com/data/v4/matches/${params.id}/stats`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${env.FACEIT_TOKEN}`,
      },
    },
  ).then((res) => res.json());

  if (match.errors) {
    return (
      <main className={"content-wrapper"}>
        <div className={NotFount.wrapper}>
          <h1>Scoreboard is not available for this match :(</h1>
          <Image src={"/remont.png"} alt="" height={112} width={112} />
        </div>
      </main>
    );
  }

  return (
    <main className={"content-wrapper"}>
      <div className={Style.teams}>
        {match.rounds[0].teams?.map((team: any) => {
          return <DotaTeam key={team.id} team={team} />;
        })}
      </div>
      <div>Match duration {match.rounds[0].round_stats.Duration} mins</div>
    </main>
  );
}
