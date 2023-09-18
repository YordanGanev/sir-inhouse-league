import Image from "next/image";
import React from "react";

import Style from "@/styles/not-found.module.css";
import Link from "next/link";

export default function notFoundPage() {
  return (
    <div className={Style.wrapper}>
      <h1>Пътят е в ремонт</h1>
      <Image src="/remont.png" alt="" height={112} width={112} />
      <Link href="/">Дай задна</Link>
    </div>
  );
}
