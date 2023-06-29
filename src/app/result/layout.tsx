import { Suspense } from "react";

export default function Result({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Fallback />}>{children}</Suspense>;
}

function Fallback() {
  return <div>YAY I FAILED</div>;
}
