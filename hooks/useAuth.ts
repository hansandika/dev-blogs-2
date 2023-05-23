import { useSession } from "next-auth/react"
import { UserProfile } from "../utils/types";

const useAuth = () => {
  const { data } = useSession()
  const user = data?.user;

  return user ? user as UserProfile : null
}

export default useAuth