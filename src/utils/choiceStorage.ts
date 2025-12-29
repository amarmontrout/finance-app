import { Choice } from "@/contexts/categories-context"

export const getChoices = ({ key }: { key: string }): Choice[] => {
  const stored = localStorage.getItem(key)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is Choice =>
        typeof item?.name === "string" &&
        typeof item?.isExcluded === "boolean" &&
        typeof item?.isRecurring === "boolean"
    )
  } catch {
    return []
  }
}

export const saveChoices = ({
  key,
  choice,
  choiceArray,
}: {
  key: string
  choice?: string
  choiceArray?: Choice[]
}) => {
  if (Array.isArray(choiceArray)) {
    if (choiceArray.length === 0) {
      localStorage.removeItem(key)
      console.log("Choices removed")
      return
    }

    const sorted =
      key === "years"
        ? [...choiceArray].sort(
            (a, b) => Number(a.name) - Number(b.name)
          )
        : [...choiceArray].sort((a, b) =>
            a.name.localeCompare(b.name)
          )

    localStorage.setItem(key, JSON.stringify(sorted))
    console.log("Choices saved")
    return
  }

  let choiceData: Choice[] = getChoices({ key })

  if (
    choice &&
    !choiceData.some((c) => c.name === choice)
  ) {
    choiceData.push({
      name: choice,
      isExcluded: false,
      isRecurring: false,
    })
  }

  if (key === "years") {
    choiceData.sort((a, b) => Number(a.name) - Number(b.name))
  } else {
    choiceData.sort((a, b) => a.name.localeCompare(b.name))
  }

  localStorage.setItem(key, JSON.stringify(choiceData))
  console.log("Choices saved")
}