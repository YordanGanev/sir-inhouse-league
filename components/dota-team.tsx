import DotaHeroes from "@/resources/heroes.json";
import DotaItems from "@/resources/items.json";

import Image from "next/image";

import Style from "./styles/DotaTeam.module.css";
import { Player_t } from "@/lib/types";

export default function DotaTeam({ team }: { team: any }) {
  const itemLabels = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
  ] as const;

  return (
    <div>
      <div className={Style.team}>
        The {team.team_stats.Faction}{" "}
        {team.team_stats["Team Win"] === "1" && <span>Winner</span>}
      </div>

      <div>
        <table className={Style.table}>
          <thead>
            <tr>
              <th>Hero</th>
              <th className={Style.player}>Player</th>
              <th>K</th>
              <th>D</th>
              <th>A</th>
              <th>Gold</th>
              <th>GPM</th>
              <th>XPM</th>
              <th>CS</th>
              <th>HD</th>
              <th>TD</th>
              <th>HH</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {team.players.map((player: Player_t) => {
              const hero = DotaHeroes.find(
                (hero) => hero.id === Number(player.player_stats.Hero),
              )?.localized_name;
              const heroName = DotaHeroes.find(
                (hero) => hero.id === Number(player.player_stats.Hero),
              )?.name.slice(14);
              return (
                <tr key={player.player_id}>
                  <td className={Style.hero}>
                    <div>
                      <Image
                        width={64}
                        height={36}
                        alt={hero || "hero"}
                        src={`https://api.opendota.com/apps/dota2/images/dota_react/heroes/${heroName}.png?`}
                      />
                      <span>{player.player_stats.Level}</span>
                    </div>
                  </td>
                  <td>{player.nickname}</td>

                  <td>{player.player_stats.Kills}</td>
                  <td>{player.player_stats.Deaths}</td>
                  <td>{player.player_stats.Assists}</td>
                  <td>{player.player_stats["Total Gold"]}</td>
                  <td>{player.player_stats["Gold/minute"]}</td>
                  <td>{player.player_stats["XP/minute"]}</td>
                  <td>{player.player_stats["Last Hits"]}</td>
                  <td>{player.player_stats["Hero Damage"]}</td>
                  <td>{player.player_stats["Tower Damage"]}</td>
                  <td>{player.player_stats["Hero Healing"]}</td>
                  <td className={Style.items}>
                    {itemLabels.map((label) => {
                      const current_item =
                        DotaItems.find(
                          (item) =>
                            item.id === Number(player.player_stats[label]),
                        )?.name || undefined;

                      return (
                        <div key={`${label}-${player.nickname}`}>
                          {current_item && <ItemImage name={current_item} />}
                        </div>
                      );
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ItemImage({ name }: { name: string }) {
  return (
    <Image
      width={48}
      height={35}
      alt={" "}
      src={`https://api.opendota.com/apps/dota2/images/dota_react/items/${name}.png`}
    />
  );
}
