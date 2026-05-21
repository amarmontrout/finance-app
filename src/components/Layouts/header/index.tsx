"use client";

import { UserInfo } from "./user-info";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-2 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 lg:py-4 2xl:px-10">
      <h1 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
        My Finances
      </h1>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
