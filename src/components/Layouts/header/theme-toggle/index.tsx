import { cn } from "@/lib/utils"
import { HookSetter } from "@/types/types"
import { Typography } from "@mui/material"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "./icons"

export function ThemeToggleSwitch({
  setIsOpen,
}: {
  setIsOpen: HookSetter<boolean>
}) {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isLight = theme === "light"

  const nextTheme = isLight ? "dark" : "light"
  const Icon = isLight ? Moon : Sun

  return (
    <button
      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
      onClick={() => {
        setTheme(nextTheme)
        setIsOpen(false)
      }}
    >
      <span
        className={cn(
          "relative grid size-[20px] place-items-center",
          !isLight && "dark:text-white",
        )}
      >
        <Icon />
      </span>

      <Typography>
        {`${nextTheme === "light" ? "Light" : "Dark"} mode`}
      </Typography>
    </button>
  )
}
