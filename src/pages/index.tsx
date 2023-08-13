import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import "../styles/main.css";
import Auth from "@/components/Auth";
import supabase from "../supabase"
import Main from "@/components/Main";

const IndexPage: React.FC<PageProps> = () => {
  const [session, setSession] = React.useState(null)

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // @ts-ignore
      setSession(session)

      console.log(session);
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // @ts-ignore
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === null) {
    return (
        <Auth />
    )
  } else {
    return (
        <Main session={session} />
    )
  }
}

export default IndexPage

export const Head: HeadFC = () => <title>Phoenix Note</title>
