import { HeroStats_t } from "@/lib/types";
import { NextResponse } from "next/server";
import { env } from "process";
import DotaHeroes from "@/resources/heroes.json";

async function getMatches(
  offset: number,
  minDate: Date,
  maxDate: Date,
): Promise<any[]> {
  try {
    const response = await fetch(
      `https://open.faceit.com/data/v4/hubs/f21f2c66-d0c6-4d58-8146-3681ba8bd94a/matches?type=past&offset=${
        offset * 50
      }&limit=50`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${env.FACEIT_TOKEN}`,
        },
        next: { revalidate: 1800 },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const currentMatches = await response.json();

    if (!currentMatches.items || currentMatches.items.length === 0) {
      return [];
    }

    const nextOffset = offset + 1;

    const remainingMatches = await getMatches(nextOffset, minDate, maxDate);

    const matches = currentMatches.items.filter((match: any) => {
      const matchDate = new Date(match.finished_at * 1000);
      return (
        match.status === "FINISHED" &&
        matchDate > minDate &&
        matchDate < maxDate
      );
    });

    return [...matches, ...remainingMatches];
  } catch (error) {
    console.error(`Error fetching matches: ${error}`);
    return [];
  }
}

async function getData(season: string) {
  const current_season = await fetch(
    `https://open.faceit.com/data/v4/leaderboards/hubs/f21f2c66-d0c6-4d58-8146-3681ba8bd94a/seasons/${season}?offset=0&limit=1`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${env.FACEIT_TOKEN}`,
      },
      cache: "force-cache",
    },
  ).then((res) => res.json());

  const minDate = new Date(current_season.leaderboard.start_date * 1000);
  const maxDate = new Date(current_season.leaderboard.end_date * 1000);
  const matches = await getMatches(0, minDate, maxDate);

  const ids = matches.map((match) => ({ match_id: match.match_id }));

  const matchDataArray = await Promise.allSettled(
    ids.map((matchId) => {
      return fetch(
        `https://open.faceit.com/data/v4/matches/${matchId.match_id}/stats`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${env.FACEIT_TOKEN}`,
          },
          next: { revalidate: 10 },
        },
      ).then((res) => res.json());
    }),
  ).then((res) =>
    res
      .filter((m) => m.status === "fulfilled" && !m.value.errors)
      .map((m: any) => m.value.rounds[0].teams),
  );

  let heroes: HeroStats_t[] = [];

  const stats = matchDataArray.forEach((match) => {
    match.forEach((team: any) => {
      const isRadiant = team.team_stats["Faction"] === "Radiant";

      if (team.team_stats["Team Win"] === "1") {
        team.players.forEach((p: any) => {
          const hero_id = Number(p.player_stats.Hero);
          if (!heroes[hero_id])
            heroes[hero_id] = {
              id: hero_id,
              name: DotaHeroes.find((h) => h.id === hero_id)?.name,
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
              name: DotaHeroes.find((h) => h.id === hero_id)?.name,
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

  return {
    total: matchDataArray.length,
    stats: heroes,
  };
}

export async function GET(
  request: Request,
  { params }: { params: { season: string } },
) {
  try {
    const { season } = params;

    const data = await getData(season);

    return NextResponse.json(data);
  } catch (e) {
    console.log(request.method, request.url);
    console.error(e);
    return new NextResponse(JSON.stringify(e), { status: 500 });
  }
}
