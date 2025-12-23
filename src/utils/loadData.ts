export const loadData = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const text = reader.result as string
        const parsed = JSON.parse(text)

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("Invalid backup file format")
        }

        Object.entries(parsed).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value))
        })

        resolve()
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(reader.error)
    }

    reader.readAsText(file)
  })
}
