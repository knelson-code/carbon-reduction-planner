import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    username: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
  }
}
