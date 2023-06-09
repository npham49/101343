import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  afterAuth(auth, req, evt) {
    // @ts-ignore
    console.log(auth.sessionClaims?.metadata?.role);
    console.log(req);
    if (req.url === `${req.nextUrl.origin}/board`) {
      // handle users who aren't authenticated
      if (!auth.userId && !auth.isPublicRoute) {
        const signInUrl = new URL("/sign-in", req.url);
        signInUrl.searchParams.set("redirect_url", req.url);
        return NextResponse.redirect(signInUrl);
      }
      // @ts-ignore
      if (auth.sessionClaims?.metadata?.role === undefined) {
        const signInUrl = new URL("/sign-in/not-thorized", req.url);
        signInUrl.searchParams.set("redirect_url", req.url);
        return NextResponse.redirect(signInUrl);
      }
    }
    // if(!auth.user?.publicMetadata.role) {
    //   const HomeUrl = new URL('/', req.url)
    //   return NextResponse.redirect(HomeUrl)
    // }
  },
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
