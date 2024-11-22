import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeContextType = { theme: "light" | "dark"; themeState: React.Dispatch<React.SetStateAction<"light" | "dark">>; };
export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ initialTheme, children }: { initialTheme: "light" | "dark"; children: React.ReactNode }) => {
    const [theme, themeState] = useState<"light" | "dark">(initialTheme);

    useEffect(() => {
        //set html's data-theme="light" or "dark"
        const html = document.querySelector("html");
        if (html) {
            html.setAttribute("data-theme", theme);
        }

        async function setThemeCookie() {
            await fetch("/?index", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ theme: theme }),
            });
        }
        setThemeCookie();
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, themeState }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};