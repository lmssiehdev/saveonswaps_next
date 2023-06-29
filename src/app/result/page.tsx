import axios from "axios";
import { Suspense } from "react";
import { z } from "zod";

const paramsSchema = z.object({
  from: z.string(),
  to: z.string(),
  amount: z.string().or(z.number()),
});

type PageProps = {
  searchParams: z.infer<typeof paramsSchema>;
};

export default async function Result({ searchParams }: PageProps) {
  const params = paramsSchema.parse(searchParams);

  const { from, to, amount } = searchParams;

  const response = await fetch("api/get-fees");
  const data = await response.json();

  return (
    <>
      <div>
        {JSON.stringify(data)}
        {from} {to} {amount}
      </div>
    </>
  );
}
