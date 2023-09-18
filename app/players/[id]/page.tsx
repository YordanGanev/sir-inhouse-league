import React from "react";

import Profile from "@/components/profile";

export default async function PlayerPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <Profile picture="a" subtitle="a" title="b" description="?" />
      TBD..
    </>
  );
}
