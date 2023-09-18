"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";

import Style from "./MatchesNav.module.css";

export default function MatchesNav(
  { isEnd = false }: { isEnd?: boolean } = { isEnd: false },
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const changePage = (page: string | null, isIncrement = true) => {
    let newPage = Number(page);

    if (isNaN(newPage)) newPage = 1;

    if (isIncrement) {
      newPage++;
    } else {
      newPage--;
      if (newPage < 0) newPage = 0;
    }

    router.push(pathname + `?page=${newPage}`);
  };

  return (
    <div className={Style.wrapper}>
      <button
        disabled={!page || page === "0"}
        className={!page || page === "0" ? Style.disabled : ""}
        onClick={() => {
          changePage(page, false);
        }}
      >
        <FontAwesomeIcon icon={faArrowCircleLeft} />
      </button>
      <span>Page: {page ? Number(page) + 1 : "1"}</span>
      <button
        className={isEnd ? Style.disabled : ""}
        disabled={isEnd}
        onClick={() => {
          changePage(page);
        }}
      >
        <FontAwesomeIcon icon={faArrowCircleRight} />
      </button>
    </div>
  );
}
