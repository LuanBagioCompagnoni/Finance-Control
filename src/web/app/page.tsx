import { redirect } from "next/navigation"

export default function RootPage() {
  redirect("/auth/sign-in")
}
