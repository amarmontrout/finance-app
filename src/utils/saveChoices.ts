const saveChoices = ({
  key,
  choice,
  choiceArray,
}: {
  key: string
  choice?: string
  choiceArray?: string[]
}) => {
  if (Array.isArray(choiceArray)) {
    if (choiceArray.length === 0) {
      localStorage.removeItem(key)
      console.log("Choices removed")
      return
    }

    const sorted =
      key === "years"
        ? [...choiceArray].sort((a, b) => Number(a) - Number(b))
        : choiceArray

    localStorage.setItem(key, JSON.stringify(sorted))
    console.log("Choices saved")
    return
  }

  let choiceData: string[] = []

  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        choiceData = parsed
      }
    } catch (error) {
      console.error("Failed to parse current choice data", error)
    }
  }

  if (choice && !choiceData.includes(choice)) {
    choiceData.push(choice)
  }

  if (key === "years") {
    choiceData.sort((a, b) => Number(a) - Number(b))
  }

  localStorage.setItem(key, JSON.stringify(choiceData))
  console.log("Choices saved")
}

export default saveChoices
