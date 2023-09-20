import Image from "next/image";
import { env } from "process";

import DotaHeroes from "@/resources/heroes.json";

import SortStats from "./SortStats";

import Style from "./Stats.module.css";

export const metadata = {
  title: "Stats",
  description: "Heroes Stats",
};

type HeroStats_t = {
  id: number;
  dire: { wins: number; loses: number };
  radiant: { wins: number; loses: number };
};

export const revalidate = 3600;

async function getData() {
  const matches = [];

  let offset = 0;
  while (true) {
    const currentMatches = await fetch(
      `https://open.faceit.com/data/v4/hubs/f21f2c66-d0c6-4d58-8146-3681ba8bd94a/matches?type=past&offset=${
        offset * 50
      }&limit=50`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${env.FACEIT_TOKEN}`,
        },
        next: { revalidate: 3600 },
      },
    ).then((res) => res.json());

    if (currentMatches.items.length === 0) break;

    matches.push(...currentMatches.items);
    offset++;
  }

  const ids = matches
    .filter((match) => match.status === "FINISHED")
    .map((match) => ({ match_id: match.match_id }));

  const matchDataArray = await Promise.allSettled(
    ids.map((matchId) => {
      return fetch(
        `https://open.faceit.com/data/v4/matches/${matchId.match_id}/stats`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${env.FACEIT_TOKEN}`,
          },
          next: { revalidate: 3600 },
        },
      ).then((res) => res.json());
    }),
  );

  return matchDataArray
    .filter((m) => m.status === "fulfilled" && !m.value.errors)
    .map((m: any) => m.value.rounds[0].teams);
}

export default async function StatsPage({
  searchParams,
}: {
  searchParams: {
    sort: string;
    order: string;
    type: string;
  };
}) {
  const matches = await getData();

  let heroes: HeroStats_t[] = [];

  matches.forEach((match) => {
    match.forEach((team: any) => {
      const isRadiant = team.team_stats["Faction"] === "Radiant";

      if (team.team_stats["Team Win"] === "1") {
        team.players.forEach((p: any) => {
          const hero_id = Number(p.player_stats.Hero);
          if (!heroes[hero_id])
            heroes[hero_id] = {
              id: hero_id,
              dire: { wins: 0, loses: 0 },
              radiant: { wins: 0, loses: 0 },
            };

          if (isRadiant) {
            heroes[hero_id].radiant.wins++;
          } else {
            heroes[hero_id].dire.wins++;
          }
        });
      } else {
        team.players.forEach((p: any) => {
          const hero_id = Number(p.player_stats.Hero);
          if (heroes[hero_id] === undefined)
            heroes[hero_id] = {
              id: hero_id,
              dire: { wins: 0, loses: 0 },
              radiant: { wins: 0, loses: 0 },
            };
          if (isRadiant) {
            heroes[hero_id].radiant.loses++;
          } else {
            heroes[hero_id].dire.loses++;
          }
        });
      }
    });
  });

  for (let i = 1; i < heroes.length; i++) {
    if (heroes[i] === undefined) {
      const currentHero = DotaHeroes.find((h) => h.id === i);
      if (currentHero) {
        heroes[i] = {
          id: i,
          dire: { wins: 0, loses: 0 },
          radiant: { wins: 0, loses: 0 },
        };
      }
    }
  }

  heroes = heroes.filter((h) => h.dire && h.radiant);

  function getWinRate(wins: number, loses: number) {
    if (wins + loses === 0) return "0";
    return ((wins / (wins + loses)) * 100).toFixed(1);
  }

  if (
    (!searchParams.sort && !searchParams.type) ||
    searchParams.sort === "picks"
  )
    heroes.sort((a, b) => {
      const aTotal =
        a.radiant.wins + a.radiant.loses + a.dire.wins + a.dire.loses;
      const bTotal =
        b.radiant.wins + b.radiant.loses + b.dire.wins + b.dire.loses;

      return bTotal - aTotal;
    });

  if (searchParams.type === "total") {
    switch (searchParams.sort) {
      case "wins":
        heroes.sort((a, b) => {
          return b.radiant.wins + b.dire.wins - (a.radiant.wins + a.dire.wins);
        });
        break;
      case "loses":
        heroes.sort((a, b) => {
          return (
            b.radiant.loses + b.dire.loses - (a.radiant.loses + a.dire.loses)
          );
        });
        break;
      case "winrate":
        heroes.sort((a, b) => {
          return (
            Number(
              getWinRate(
                b.radiant.wins + b.dire.wins,
                b.radiant.loses + b.dire.loses,
              ),
            ) -
            Number(
              getWinRate(
                a.radiant.wins + a.dire.wins,
                a.radiant.loses + a.dire.loses,
              ),
            )
          );
        });
        break;
    }
  } else if (searchParams.type === "radiant") {
    switch (searchParams.sort) {
      case "wins":
        heroes.sort((a, b) => {
          return b.radiant.wins - a.radiant.wins;
        });
        break;
      case "loses":
        heroes.sort((a, b) => {
          return b.radiant.loses - a.radiant.loses;
        });
        break;
      case "winrate":
        heroes.sort((a, b) => {
          return (
            Number(getWinRate(b.radiant.wins, b.radiant.loses)) -
            Number(getWinRate(a.radiant.wins, a.radiant.loses))
          );
        });
        break;
    }
  } else if (searchParams.type === "dire") {
    switch (searchParams.sort) {
      case "wins":
        heroes.sort((a, b) => {
          return b.dire.wins - a.dire.wins;
        });
        break;
      case "loses":
        heroes.sort((a, b) => {
          return b.dire.loses - a.dire.loses;
        });
        break;
      case "winrate":
        heroes.sort((a, b) => {
          return (
            Number(getWinRate(b.dire.wins, b.dire.loses)) -
            Number(getWinRate(a.dire.wins, a.dire.loses))
          );
        });
        break;
    }
  }

  if (searchParams.order === "desc") {
    heroes.reverse();
  }

  return (
    <main className={`content-wrapper`}>
      <table className={Style.table}>
        <thead>
          <tr>
            <th colSpan={2}></th>
            <th colSpan={4}>Total</th>
            <th colSpan={3}>Radiant</th>
            <th colSpan={3}>Dire</th>
          </tr>
          <tr>
            <th>#</th>
            <th>Hero</th>
            <SortStats sortType="total" usePicks={true} />
            <SortStats sortType="radiant" />
            <SortStats sortType="dire" />
          </tr>
        </thead>
        <tbody>
          {heroes.map((hero, index) => {
            const currentHero = DotaHeroes.find((h) => h.id === hero.id);
            if (!currentHero) return null;

            return (
              <tr key={hero.id}>
                <td>{index + 1}</td>
                <td className={Style.hero}>
                  <Image
                    src={`https://api.opendota.com/apps/dota2/images/dota_react/heroes/${currentHero.name.slice(
                      14,
                    )}.png?`}
                    alt={`hero-icon-${hero.id}`}
                    width={36}
                    height={20}
                  />
                  <span>{currentHero.localized_name}</span>
                </td>
                <td>
                  {hero.radiant.wins +
                    hero.radiant.loses +
                    hero.dire.wins +
                    hero.dire.loses}
                </td>
                <td>{hero.radiant.wins + hero.dire.wins}</td>
                <td>{hero.radiant.loses + hero.dire.loses}</td>
                <td>
                  {`${getWinRate(
                    hero.radiant.wins + hero.dire.wins,
                    hero.radiant.loses + hero.dire.loses,
                  )} %`}
                </td>
                <td>{hero.radiant.wins}</td>
                <td>{hero.radiant.loses}</td>
                <td>
                  {`${getWinRate(hero.radiant.wins, hero.radiant.loses)} %`}
                </td>
                <td>{hero.dire.wins}</td>
                <td>{hero.dire.loses}</td>
                <td>{`${getWinRate(hero.dire.wins, hero.dire.loses)} %`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={Style.info}>Total games played {matches.length}</div>
    </main>
  );
}
