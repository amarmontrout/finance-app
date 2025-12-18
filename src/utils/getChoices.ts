const getChoices = (props: {
  key: string
}) => {
  const { key } = props
  if (typeof window === "undefined") {
    return []
  }
  const localData = localStorage.getItem(key)
  if (localData) {
    try {
      return JSON.parse(localData) as string[]
    } catch (error) {
      console.log("Could not parse local data", error)
      return null
    }
  }
  console.log("No local data found")
  return null
}

export default getChoices