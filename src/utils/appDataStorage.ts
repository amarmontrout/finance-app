type SaveLocalStorageProps = {
  keys: string[]
  fileName?: string
}

export const saveData = ({
  keys,
  fileName = "financial-app-data.json",
}: SaveLocalStorageProps) => {
  if (typeof window === "undefined") return

  const dataToSave: Record<string, unknown> = {}

  keys.forEach((key) => {
    const value = localStorage.getItem(key)
    if (value) {
      try {
        dataToSave[key] = JSON.parse(value)
      } catch {
        dataToSave[key] = value
      }
    }
  })

  const fileContents = JSON.stringify(dataToSave, null, 2)
  const blob = new Blob([fileContents], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

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
