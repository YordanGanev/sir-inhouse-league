import DotaHeroes from "@/resources/heroes.json";
import DotaItems from "@/resources/items.json";
import Profile from "@/components/profile";

import { getPlaceholderImage, itemLabels, passTimeString } from "@/lib/common";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import Image from "next/image";

export default async function PlayerPage({
  params,
}: {
  params: { season: string; id: string };
}) {
  const leaderboards_data = await fetch(
    "https://open.faceit.com/data/v4/leaderboards/hubs/f21f2c66-d0c6-4d58-8146-3681ba8bd94a?offset=0&limit=50",
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.FACEIT_TOKEN}`,
      },
    },
  ).then((res) => res.json());

  const seasons = leaderboards_data.items.filter((season: any) => {
    if (season.season) return season;
  });

  const player = await fetch(
    `https://open.faceit.com/data/v4/players/${params.id}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.FACEIT_TOKEN}`,
      },
      next: {
        revalidate: 86400,
      },
    },
  ).then((res) => res.json());

  const matches = await fetch(
    `https://open.faceit.com/data/v4/players/${params.id}/games/dota2/stats?offset=0&limit=25`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.FACEIT_TOKEN}`,
      },
      next: {
        revalidate: 1800,
      },
    },
  ).then((res) => res.json());

  const player_leaderboards = await Promise.allSettled(
    seasons.map((season: any) => {
      console.log(season.leaderboard_id);
      return fetch(
        `https://open.faceit.com/data/v4/leaderboards/${season.leaderboard_id}/players/${params.id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.FACEIT_TOKEN}`,
          },
          next: {
            revalidate: season.status === "FINISHED" ? false : 1800,
          },
        },
      ).then(async (res) => {
        const data = await res.json();
        data.id = season.leaderboard_id;
        data.season = season.season;
        return data;
      });
    }),
  );

  const now = new Date();

  console.log(player_leaderboards);

  return (
    <div className="content-wrapper">
      <Profile
        picture={
          player.avatar
            ? player.avatar
            : getPlaceholderImage(player.nickname.slice(0, 2).toLowerCase())
        }
        title={player.nickname}
        subtitle={player.games.dota2.game_player_name}
      />

      <h2 className="text-xl pt-6 pb-6 ">Leaderboards</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {player_leaderboards.map((season: any) => {
          if (season.status === "fulfilled")
            return (
              <div
                key={`info-${season.season_id}`}
                className="flex items-center p-2 flex-col md:flex-1 pb-4 bg-white/5 rounded-sm md:rounded-md"
              >
                <h3 className="text-xl text-center pb-4">
                  Season {season.value.season}
                </h3>
                <div className="flex gap-4">
                  <div className="border-orange-600 border-t-2 pl-2 pr-2 text-center">
                    <div>Place</div>
                    <div>{season.value.position}</div>
                  </div>
                  <div className="border-orange-600 border-t-2 pl-2 pr-2 text-center">
                    <div>Played</div>
                    <div>{season.value.played}</div>
                  </div>
                  <div className="border-orange-600 border-t-2 pl-2 pr-2 text-center">
                    <div>Won</div>
                    <div>{season.value.won}</div>
                  </div>
                  <div className="border-orange-600 border-t-2 pl-2 pr-2 text-center">
                    <div>Streak</div>
                    <div>{season.value.current_streak}</div>
                  </div>
                </div>
              </div>
            );
        })}
      </div>

      <h2 className="text-xl pt-6 pb-6">Recent Matches</h2>
      <Table>
        <TableCaption>Recent matches (refreshes on 30 mins) </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Hero</TableHead>
            <TableHead>Result</TableHead>
            <TableHead className="">GPM</TableHead>
            <TableHead className="">XPM</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>KDA</TableHead>
            <TableHead className="">Items</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.items.map((match: any) => {
            const hero = DotaHeroes.find(
              (hero) => hero.id == match.stats["Hero"],
            )?.name?.replace("npc_dota_hero_", "");

            return (
              <TableRow key={match.stats["Match Id"]}>
                <TableCell>
                  <div className="max-w-[64px] max-h-[36px] min-w-[64px] min-h-[36px]  relative">
                    <Image
                      alt={`hero`}
                      src={`https://api.opendota.com/apps/dota2/images/dota_react/heroes/${hero}.png`}
                      width={64}
                      height={36}
                    />
                    <span className="text-[smaller] absolute bottom-0 right-0 p-[2px] bg-black/60">
                      {match.stats.Level}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-[10ch]">
                    <Link
                      className={`hover:opacity-70 ${
                        match.stats.Result === "1"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                      href={`/matches/${match.stats["Match Id"]}`}
                    >
                      Match {match.stats.Result === "1" ? "Won" : "Lost"}
                    </Link>
                  </div>
                  <div className="">
                    {passTimeString(new Date(match.stats["Created At"]))}
                  </div>
                </TableCell>
                <TableCell className="">{match.stats["Gold/minute"]}</TableCell>
                <TableCell className="">{match.stats["XP/minute"]}</TableCell>
                <TableCell>{match.stats.Duration} mins</TableCell>
                <TableCell>
                  <div className="">
                    {match.stats.Kills}/{match.stats.Deaths}/
                    {match.stats.Assists}
                  </div>
                  <div className="flex pt-2">
                    <div
                      style={{ flex: match.stats.Kills }}
                      className={`h-1 bg-green-600`}
                    ></div>
                    <div
                      style={{ flex: match.stats.Deaths }}
                      className={`h-1 bg-red-600`}
                    ></div>
                    <div
                      style={{ flex: match.stats.Assists }}
                      className={`h-1 bg-orange-400`}
                    ></div>
                  </div>
                </TableCell>
                <TableCell className="grid grid-cols-3 min-w-[100px] max-w-fit">
                  {itemLabels.map((label) => {
                    const current_item =
                      DotaItems.find(
                        (item) => item.id === Number(match.stats[label]),
                      )?.name || undefined;

                    return (
                      <div
                        key={`${label}-${match.stats["Match Id"]}`}
                        className=""
                      >
                        {current_item && (
                          <Image
                            alt={" "}
                            src={`https://api.opendota.com/apps/dota2/images/dota_react/items/${current_item}.png`}
                            width={42}
                            height={31}
                          />
                        )}
                      </div>
                    );
                  })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
