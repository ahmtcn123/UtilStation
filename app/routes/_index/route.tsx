import { json, type ActionFunction, type LinksFunction, type MetaFunction } from "@remix-run/cloudflare";
import Header from "../../components/Header";
import Undraw from "../../components/Undraw";

import UndrawLikeDislike from "~/assets/undraw_like_dislike_re_dwcj.svg";
import UndrawVisionaryTechnology from "~/assets/undraw_visionary_technology_re_jfp7.svg";
import Footer from "~/components/Footer";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";
import { themeCookie } from "~/cookies/themeCookie";

export const meta: MetaFunction = ({ location }) => {
  return [
    ...CommonMetaGenerator({
      title: "UtilStation - Your one stop shop for all tools",
      location,
    }),
  ];
};

export const links: LinksFunction = () => {
  return [
    ...CommonLinksGenerator()
  ];
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const theme = formData.get("theme");

  if (typeof theme != "string" || !["light", "dark"].includes(theme)) {
    return json({ error: "Invalid theme" }, { status: 400 });
  }

  return json(
    { theme },
    {
      headers: { "Set-Cookie": await themeCookie.serialize(theme) },
    }
  );
}

export default function Index() {
  return (
    <main className="flex-grow">
      <Header />
      <section className="p-5 mx-auto w-full border-b border-currentCollor flex items-center lg:justify-between flex-col lg:flex-row">
        <div className="flex flex-col justify-center lg:text-start text-center">
          <h1 className="text-5xl">UtilStation: Your one stop shop for all tools</h1>
          <p className="text-1xl mt-5">
            UtilStation provides various tools various situations, You can
            access every tool you need in one single app
          </p>
        </div>
        <div style={{ height: "200px" }}>
          <Undraw src={UndrawVisionaryTechnology} height="200px" />
        </div>
      </section>
      <section className="p-5 mx-auto w-full border-b border-currentCollor flex items-center lg:justify-between flex-col lg:flex-row">
        <div className="flex flex-col justify-center lg:text-start text-center">
          <h1 className="text-5xl">Favorites</h1>
          <p className="text-1xl mt-5">
            Make UtilStation visit better with <span className="text-primary">favorite</span> tools
          </p>
        </div>
        <div style={{ height: "200px" }}>
          <Undraw src={UndrawLikeDislike} height="200px" />
        </div>
      </section>
      <section className="p-5 mx-auto w-full border-b border-currentCollor flex items-center lg:justify-between flex-col lg:flex-row">
        <div className="flex flex-col justify-center lg:text-start text-center">
          <h1 className="text-5xl">API and Visual solutions</h1>
          <p className="text-1xl mt-5">
            UtilStation provides both API interface for developers and App
            for everyday user.
          </p>
        </div>
        <div style={{ height: "200px" }}>
          <Undraw src={UndrawVisionaryTechnology} height="200px" />
        </div>
      </section>
      <Footer />
    </main>
  );
}
