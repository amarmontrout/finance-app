"use client";

import { doLogout } from "@/api/auth/requests";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { getCurrentDateInfo } from "@/global/infoFunctions";
import { useUser } from "@/hooks/use-user";
import CloseIcon from "@mui/icons-material/Close";
import { AuthError } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MenuIcon } from "../icons";
import { LogOutIcon, SettingsIcon } from "./icons";

export function UserInfo() {
  const router = useRouter();
  const user = useUser();
  const { currentMonthString, currentDay, currentYear } = getCurrentDateInfo();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogOut = () => {
    doLogout({
      router: router,
      errorHandler: (error: AuthError) => {
        console.error(error.message);
      },
    });
    setIsOpen(false);
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {`${currentMonthString} ${currentDay}, ${currentYear}`}
            </div>

            <div className="leading-none text-gray-6">{user?.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        {/* <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <ThemeToggleSwitch setIsOpen={setIsOpen} />
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" /> */}

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogOut}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
