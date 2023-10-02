"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Style from "./SortTypes.module.css";
import { playerSortLables } from "@/lib/common";

export default function SortTypes() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sort = searchParams.get("sort");
  const order = searchParams.get("order");

  return (
    <tr className={Style.wrapper}>
      <th>#</th>
      <th>Бездарник</th>
      {playerSortLables.map((label) => {
        return (
          <th key={label} className={sort === label ? Style.sort : ""}>
            <button
              onClick={() => {
                if (sort === label) {
                  if (!order || order === "asc")
                    router.push(pathname + `?sort=${label}&order=desc`);
                  else router.push(pathname + `?sort=${label}&order=asc`);
                } else {
                  router.push(pathname + `?sort=${label}`);
                }
              }}
            >
              {label}
            </button>
          </th>
        );
      })}
    </tr>
  );
}
