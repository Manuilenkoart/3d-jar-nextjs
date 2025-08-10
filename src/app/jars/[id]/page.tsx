import Jar from "@/ui/Jar";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return redirect("/");

  return <Jar clientId={id} />;
}
