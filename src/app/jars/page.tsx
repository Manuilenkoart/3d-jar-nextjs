import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/lib/constants";

export default async function Page() {
  const cookieStore = await cookies();
  const { value } = cookieStore.get(COOKIE_KEYS.jarId) ?? {};

  return value ? redirect("/jars/" + value) : redirect("/");
}
