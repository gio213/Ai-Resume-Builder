import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ka", name: "ქართული" },
];

const LanguageSwitcher = () => {
  const [currentLocale, setCurrentLocale] = useState("ka");

  useEffect(() => {
    const locale = Cookies.get("locale") || "ka";
    if (!locale) {
      Cookies.set("locale", "ka", { expires: 365 });
    } else {
      setCurrentLocale(locale);
    }
  }, []);

  const changeLanguage = (locale: string) => {
    Cookies.set("locale", locale, { expires: 365 });
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="border-0" variant="outline" size="icon">
          {currentLocale === "ka" ? "KA" : "EN"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-y-0.5" align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${currentLocale === lang.code ? "bg-accent" : ""}`}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
