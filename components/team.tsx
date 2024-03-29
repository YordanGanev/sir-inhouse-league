import { getPlaceholderImage } from "@/lib/common";
import Image from "next/image";

import Style from "./styles/Team.module.css";
import PlayerImage from "./PlayerImage";

export default function Team({
  team,
  hasWon,
  isFirst,
}: {
  team: any;
  hasWon: boolean;
  isFirst: boolean;
}) {
  return (
    <div
      className={`${Style.container} ${hasWon ? Style.win : Style.lose} ${
        isFirst ? Style.first : Style.second
      }`}
    >
      {team.roster.map((player: any) => {
        return (
          <div
            key={player.player_id}
            className={team.leader === player.player_id ? Style.leader : ""}
          >
            <PlayerImage
              alt={player.nickname.slice(0, 2).toLowerCase()}
              src={
                player.avatar !== ""
                  ? player.avatar
                  : getPlaceholderImage(
                      player.nickname.slice(0, 2).toLowerCase(),
                    )
              }
            />
          </div>
        );
      })}
    </div>
  );
}
