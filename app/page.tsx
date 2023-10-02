import Image from "next/image";
import Link from "next/link";

import Style from "./Home.module.css";
import Profile from "@/components/profile";
import { env } from "process";

export default async function Home() {
  const general = await fetch(
    "https://open.faceit.com/data/v4/hubs/f21f2c66-d0c6-4d58-8146-3681ba8bd94a?expanded=organizer",
    {
      headers: {
        Access: "application/json",
        Authorization: `Bearer ${env.FACEIT_TOKEN}`,
      },
      next: {
        revalidate: 86400,
      },
    },
  ).then((res) => res.json());

  const infoList = [
    { value: general.game_id, label: "Game" },
    { value: general.region, label: "Region" },
    { value: general.players_joined, label: "Players" },
  ];

  return (
    <main className={`content-wrapper`}>
      <div className="max-w-max mx-auto pt-2 pb-4">
        <Profile
          picture={general.avatar}
          title={general.name}
          description={general.description}
          subtitle="Bulgarian Dota 2 Hub"
        />
      </div>

      <div className="pt-2 pb-4 flex gap-12 align-middle flex-col sm:flex-row sm:justify-center">
        <div className="">
          <Image
            src={general.background_image}
            alt={`${general.name} background image`}
            width={700}
            height={410}
          />
        </div>
        <div className="flex-1">
          <ul className="flex sm:flex-col gap-8">
            {infoList.map((info) => (
              <li
                key={info.value}
                className="p-4 flex-col flex gap-2 flex-1 bg-white/5"
              >
                <span className="text-center font-semibold text-orange-600">
                  {info.label}
                </span>
                <span className="text-center capitalize">{info.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
