import { redirect } from "next/navigation";
import React from "react";

export default async function Season({
  params,
}: {
  params: { season: string };
}) {
  redirect(`/seasons/${params.season}/stats`);
}
