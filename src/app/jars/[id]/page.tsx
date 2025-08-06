import { fetchMainJarInfo } from "@/lib/hooks";
import Jar from "@/ui/Jar";
import { redirect } from "next/navigation";

export default async function Page({ params }: { 
  params: { id: string } 
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { id } = await params;

  if (!id) return redirect("/");

  const mainJarInfo = await fetchMainJarInfo(id);

  return <Jar mainJarInfo={mainJarInfo} />;
}
