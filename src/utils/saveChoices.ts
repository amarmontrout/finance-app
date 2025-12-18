const saveChoices = (props: {
  key: string
  choice: string
}) => {

  const {
    key,
    choice
  } = props

  const currentChoiceData = localStorage.getItem(key)
  let choiceData: string[] = []

  if(currentChoiceData) {
    try {
      choiceData = JSON.parse(currentChoiceData) as string[]
    } catch (error) {
      console.error("Failed to parse current choice data", error)
    }
  }

  if (choice) {
    try {
      if (!choiceData.includes(choice)) {
        choiceData.push(choice)        
      }

      if (key === "years") {
        choiceData.sort((a, b) => Number(a) - Number(b));
      }

      localStorage.setItem(key, JSON.stringify(choiceData));
      console.log("Choice saved");
    } catch (error) {
      console.error("Failed to save choice", error)
    }
  }
}

export default saveChoices