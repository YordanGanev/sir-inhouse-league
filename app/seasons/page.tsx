import { NavOptions, isNavItem } from "@/lib/common";
import Link from "next/link";
import { env } from "process";
import React from "react";

export default async function SeasonPage({
  searchParams: { source },
}: {
  searchParams: { source?: string };
}) {
  const isValidItem = isNavItem(source);
  const dir = isValidItem ? `${source}` : "stats";
  const label = NavOptions.find(
    (item) => item.value === source,
  )?.label.toLowerCase();

  const data = await fetch(
    "https://open.faceit.com/data/v4/leaderboards/hubs/f21f2c66-d0c6-4d58-8146-3681ba8bd94a?offset=0&limit=50",
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${env.FACEIT_TOKEN}`,
      },
      next: { revalidate: 86400 },
    },
  ).then((res) => res.json());

  const seasons = data.items
    .filter((s: any) => {
      if (s.season) return s;
    })
    .sort((a: any, b: any) => {
      return a.season - b.season;
    });

  return (
    <>
      <div className="content-wrapper">
        <h2 className="text-4xl mt-2 mb-4 text-center">Select a season</h2>
        <p className="text-xl mb-8 text-gray-50/80 text-center">
          Please select a season to explore {label}
        </p>

        <div>
          <ol className="flex sm:flex-row flex-wrap justify-start gap-8 flex-col">
            {seasons.map((season: any) => {
              return (
                <li
                  className="md:w-[calc(33%-2rem)] border-gray-50/20 p-4 border-l-2 md:border-l-0 md:border-t-2"
                  key={season.leaderboard_id}
                >
                  <span className=" text-orange-500">
                    Season {season.season}
                  </span>
                  <Link
                    className="hover:opacity-70"
                    href={`/seasons/${season.season}/${dir}`}
                  >
                    <h3 className="pt-4 pb-4 text-xl font-semibold">
                      {season.leaderboard_name}
                    </h3>
                  </Link>

                  <p className="text-gray-50/70">
                    Started on{" "}
                    <span>
                      {new Date(season.start_date * 1000).toLocaleDateString(
                        "en",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </p>
                  <p className="text-gray-50/70">
                    End date{" "}
                    <span>
                      {" "}
                      {new Date(season.end_date * 1000).toLocaleDateString(
                        "en",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </p>
                  <p>
                    Status :
                    <span className="capitalize pl-2 ">
                      {season.status.toLowerCase()}
                    </span>
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
