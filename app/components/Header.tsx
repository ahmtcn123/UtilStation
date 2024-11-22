import { MagnifyingGlassIcon, MoonIcon, SunIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Tools from "~/routes/_index/tools.json";
import { toSnakeCase } from "~/utils";
import { useTheme } from "~/utils/themeController";
import tailwindTheme from "../../tailwind.config";
import LogoDark from "./LogoDark";
import LogoWhite from "./LogoWhite";


export type Tool = {
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  urlName?: string;
  mobileSupported?: boolean;
  tags: string[];
}

export type Category = {
  name: string;
  description: string;
  tools?: Tool[];
  subCategories?: Category[];
  enabled: boolean;
  urlName?: string;
}

function HeaderLinks(props: { className: string }) {
  function renderCategory(linkRoot: string, category: Category, key: string) {
    const lis = [];

    let subCategoryIdx = 0;
    for (const subCategory of category.subCategories || []) {
      if (subCategory.enabled) {
        const subCategoryKey = `${key}_${subCategoryIdx++}_${subCategory.name}`;
        lis.push(<li key={subCategoryKey}>
          <details>
            <summary>{subCategory.name}</summary>
            <ul key={subCategory.name}>
              {renderCategory(`${linkRoot}/${toSnakeCase(subCategory.name)}`, subCategory, subCategoryKey)}
            </ul>
          </details>
        </li>)
      }
    }

    let toolIdx = 0;
    for (const tool of category.tools || []) {
      if (tool.enabled) {
        lis.push(
          <li key={`${key}_${toolIdx++}_${tool.name}`}>
            <Link to={`/${linkRoot}/${tool.urlName ? tool.urlName : toSnakeCase(tool.name)}`}>{tool.name}</Link>
          </li>
        );
      }
    }

    return lis;
  }

  return (
    <ul className={props.className}>
      {
        (Tools.mainCategories as Category[]).map((category, idx) => {
          return <li key={`${idx}_${category.name}`}>
            <details>
              <summary>{category.name}</summary>
              <ul>
                {renderCategory(`${toSnakeCase(category.name)}`, category, `${idx}_${toSnakeCase(category.name)}`)}
              </ul>
            </details>
          </li>
        })
      }
    </ul>
  );
}


export default function Header() {
  const { theme: theme, themeState } = useTheme();
  const [isSearchOpen, setSearchOpen] = useState(false);

  const toggleTheme = () => {
    themeState(theme === "light" ? "dark" : "light");
  };

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  }

  return (
    <div className="navbar bg-base-100 border-b border-currentColor sticky top-0 z-[99]">
      <div className="navbar-start">
        <div className="dropdown">
          <div aria-label="Menu Button" tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <HeaderLinks className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow" />
        </div>
        <Link to="/">
          <div className="flex gap-0 content-around">
            <div className="flex items-center gap-1">
              {theme === "dark" ? (
                <LogoWhite style={{ fontSize: 2, width: 35 }} />
              ) : (
                <LogoDark style={{ fontSize: 2, width: 35 }} />
              )}
              <span className="text-xl font-light">UtilStation</span>
            </div>
            <span className="indicator-item badge badge-primary ml-1">Beta</span>
          </div>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li className="hidden">
            <Link className="text-secondary" to="/all-categories">
              Favorite Tools
            </Link>
          </li>
          <li>
            <Link to="/all-categories">
              All Categories
            </Link>
          </li>
        </ul>
        {/* Dot for separation */}
        <div className="bg-primary rounded-full w-1 h-1"></div>
        <HeaderLinks className="menu menu-horizontal px-1" />
      </div>
      <div className="navbar-end gap-2">
        <label className="btn btn-circle sm:btn-md btn-sm swap swap-rotate hidden">
          <input
            type="checkbox"
            onClick={toggleSearch}
            className="hidden"
          />
          <MagnifyingGlassIcon
            className="swap-off size-6 fill-current"
          />
          <XMarkIcon
            className="swap-on size-6 fill-current"
          />
        </label>

        <label className="btn btn-circle sm:btn-md btn-sm swap swap-rotate">
          <input
            type="checkbox"
            onClick={toggleTheme}
            className="hidden"
          />
          <SunIcon
            className="swap-on size-5 sm:size-6 fill-current"
          />
          <MoonIcon
            className="swap-off size-5 sm:size-6 fill-current"
          />
        </label>
      </div>
    </div >
  );
}

