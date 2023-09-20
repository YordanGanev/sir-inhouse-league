import { getPlaceholderImage } from "@/utils/common";
import Image from "next/image";
import React from "react";

import Style from "./Players.module.css";
import SortTypes from "./SortTypes";
import { env } from "process";

export const revalidate = 3600;


export const metadata = {
  title: "Players",
  description: "Players",
};

interface User {
  current_streak: number;
  draw: number;
  lost: number;
  played: number;
  player: {
    avatar: string;
    country: string;
    faceit_url: string;
    membership_type: string;
    memberships: string[];
    nickname: string;
    skill_level: number;
    user_id: string;
  };
  points: number;
  position: number;
  win_rate: number;
  won: number;
}

interface PlayerStats {
  nickname: string;
  player_id: string;
  stats: {
    "Average Total Gold": string;
    "Average Hero Healing": string;
    "Total Gold": string;
    "Hero Healing": string;
    Denies: string;
    "Average Hero Damage": string;
    "Average Last Hits": string;
    "Average Gold/minute": string;
    Matches: string;
    "Average Kills": string;
    Result: number;
    "Average XP/minute": string;
    "Average Tower Damage": string;
    Kills: string;
    "Hero Damage": string;
    "Average K/D Ratio": string;
    "Tower Damage": string;
    "Average Denies": string;
    "XP/minute": string;
    "K/D Ratio": string;
    "Average Deaths": string;
    Assists: string;
    "Gold/minute": string;
    "Win Rate %": string;
    Deaths: string;
    "Average Assists": string;
    "Last Hits": string;
  };
}

async function getPlayers() {
  let fetchId = 0;
  const players = [];
  const stats = [];

  while (true) {
    const current = await fetch(
      `https://open.faceit.com/data/v4/leaderboards/hubs/f21f2c66-d0c6-4d58-8146-3681ba8bd94a/seasons/1?offset=${
        50 * fetchId
      }&limit=50`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${env.FACEIT_TOKEN}`,
        },
        next: {
          revalidate: 3600,
        },
      },
    ).then((res) => res.json());

    if (current.items.length === 0) {
      break;
    }

    fetchId++;
    players.push(...current.items);
  }

  fetchId = 0;

  while (true) {
    const current = await fetch(
      `https://open.faceit.com/data/v4/hubs/f21f2c66-d0c6-4d58-8146-3681ba8bd94a/stats?offset=${
        25 * fetchId
      }&limit=25`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${env.FACEIT_TOKEN}`,
        },
        next: {
          revalidate: 3600,
        },
      },
    )
      .then((res) => res.json())
      .catch(() => {
        return { players: [] };
      });

    if (
      (current.players?.length && current.players?.length === 0) ||
      current.errors
    ) {
      break;
    }

    fetchId++;

    stats.push(...current.players);
  }

  // link 2 arrays
  const userMap = new Map<string, User>();
  const linkedData: (User & PlayerStats)[] = [];

  players.forEach((player) => {
    userMap.set(player.player.user_id, player);
  });

  stats.forEach((playerStat) => {
    const user = userMap.get(playerStat.player_id);
    if (user) {
      linkedData.push({ ...user, ...playerStat });
    }
  });
  return linkedData;
}

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: { sort?: string; order?: "asc" | "desc" };
}) {
  const { sort, order } = searchParams;

  const players = await getPlayers();
  players.sort((a, b) => {
    switch (sort) {
      case "Streak":
        return Number(b.current_streak) - Number(a.current_streak);
      case "Games":
        return Number(b.played) - Number(a.played);
      case "Wins":
        return Number(b.won) - Number(a.won);
      case "WR %":
        return Number(b.win_rate) - Number(a.win_rate);
      case "GPM":
        return (
          Number(b.stats["Average Gold/minute"]) -
          Number(a.stats["Average Gold/minute"])
        );
      case "XPM":
        return (
          Number(b.stats["Average XP/minute"]) -
          Number(a.stats["Average XP/minute"])
        );
      case "KDA":
      case "LH":
        return (
          Number(b.stats["Average Last Hits"]) -
          Number(a.stats["Average Last Hits"])
        );

      case "HD":
        return (
          Number(b.stats["Average Hero Damage"]) -
          Number(a.stats["Average Hero Damage"])
        );

      case "TD":
        return (
          Number(b.stats["Average Tower Damage"]) -
          Number(a.stats["Average Tower Damage"])
        );

      case "HH":
        return (
          Number(b.stats["Average Hero Healing"]) -
          Number(a.stats["Average Hero Healing"])
        );

      default:
        return Number(a.position) - Number(b.position);
    }
  });

  order === "desc" && players.reverse();

  return (
    <main className={`content-wrapper `}>
      <table className={Style.table}>
        <thead>
          <SortTypes />
        </thead>
        <tbody>
          {players.map((player, index) => {
            return (
              <tr key={player.player_id}>
                <td>{index + 1}</td>
                <td className={Style.player}>
                  <Image
                    alt={player.nickname}
                    src={
                      player?.player?.avatar === undefined ||
                      player?.player.avatar === ""
                        ? getPlaceholderImage(
                            player.nickname.slice(0, 2).toLowerCase(),
                          )
                        : player.player.avatar
                    }
                    width={36}
                    height={36}
                  />
                  <div>{player.nickname}</div>
                </td>
                <td>{player.points}</td>
                <td>{player.current_streak}</td>
                <td>{player.stats.Matches}</td>
                <td>{player.won}</td>
                <td>{player.stats["Win Rate %"]}</td>
                <td>{player.stats["Average Gold/minute"]}</td>
                <td>{player.stats["Average XP/minute"]}</td>
                <td>
                  {(
                    (Number(player.stats.Kills) +
                      Number(player.stats.Assists)) /
                    (Number(player.stats.Deaths) != 0
                      ? Number(player.stats.Deaths)
                      : 1)
                  ).toFixed(2)}
                </td>
                <td>{player.stats["Average Last Hits"]}</td>
                <td>{player.stats["Average Hero Damage"]}</td>
                <td>{player.stats["Average Tower Damage"]}</td>
                <td>{player.stats["Average Hero Healing"]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
