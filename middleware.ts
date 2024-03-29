import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
	DEFAULT_LOGIN_REDIRECT,
	apiAuthPrefix,
	authRoutes,
	publicRoutes,
} from "@/routes";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	console.log({ NextAuthRequest: req })
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;
	// console.log({ ReqAuthUser: req.auth.user });

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (isApiAuthRoute) {
		return null;
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}
		return null;
	}

	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL("/auth/login", nextUrl));
	}

	// const res = NextResponse.next();
	// console.log(res);
	// res.cookies.set({
	// 	name: 'auth-token',
	// 	value: 'fast',
	// 	path: '/',
	// })

	// return res;
	return null;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
	// matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
	// matcher: ["/auth/login", "/auth/register"],
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
