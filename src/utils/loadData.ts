export const loadData = (
  file: File
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);

        if (typeof parsed !== "object" || parsed === null) {
          throw new Error("Invalid backup file format");
        }

        Object.entries(parsed).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsText(file);
  });
};
