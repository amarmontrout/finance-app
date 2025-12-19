const saveChoices = ({
  key,
  choice,
  choiceArray,
}: {
  key: string
  choice?: string
  choiceArray?: string[]
}) => {
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

  if (choiceArray && choiceArray.length > 0) {
    choiceData = [...choiceArray]
  } 
  else if (choice && !choiceData.includes(choice)) {
    choiceData.push(choice)
  }

  if (key === "years") {
    choiceData.sort((a, b) => Number(a) - Number(b))
  }

  try {
    localStorage.setItem(key, JSON.stringify(choiceData))
    console.log("Choices saved")
  } catch (error) {
    console.error("Failed to save choices", error)
  }
}

export default saveChoices
