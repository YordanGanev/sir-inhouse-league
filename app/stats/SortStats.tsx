"use client";

import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SortType_t = "radiant" | "dire" | "total";

export default function SortStats({
  sortType,
  usePicks,
}: {
  sortType: SortType_t;
  usePicks?: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const type = searchParams.get("type");

  const statsSortLables = ["wins", "loses", "winrate"];

  if (usePicks === true) statsSortLables.splice(0, 0, "picks");

  return (
    <>
      {statsSortLables.map((label) => {
        return (
          <th key={label}>
            <button
              onClick={() => {
                if (sort === label && type === sortType) {
                  if (!order || order === "asc")
                    router.push(
                      pathname + `?sort=${label}&type=${sortType}&order=desc`,
                    );
                  else
                    router.push(
                      pathname + `?sort=${label}&type=${sortType}&order=asc`,
                    );
                } else {
                  router.push(pathname + `?sort=${label}&type=${sortType}`);
                }
              }}
            >
              {label}{" "}
              {sort === label &&
                type === sortType &&
                (order === "desc" ? (
                  <FontAwesomeIcon icon={faSortUp} />
                ) : (
                  <FontAwesomeIcon icon={faSortDown} />
                ))}
            </button>
          </th>
        );
      })}
    </>
  );
}
