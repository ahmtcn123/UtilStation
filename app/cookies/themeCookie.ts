// app/cookies/themeCookie.js

import { createCookie } from "@remix-run/cloudflare";

export const themeCookie = createCookie("theme", {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
});
