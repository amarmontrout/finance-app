type SaveLocalStorageProps = {
  keys: string[];
  fileName?: string;
};

export const saveData = ({
  keys,
  fileName = "financial-app-data.txt",
}: SaveLocalStorageProps) => {
  if (typeof window === "undefined") return;

  const dataToSave: Record<string, unknown> = {};

  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        dataToSave[key] = JSON.parse(value);
      } catch {
        dataToSave[key] = value;
      }
    }
  });

  const fileContents = JSON.stringify(dataToSave, null, 2);
  const blob = new Blob([fileContents], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
