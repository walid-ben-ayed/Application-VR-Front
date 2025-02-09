export const readFileContent = (filePath) =>
    new Promise((resolve, reject) => {
      fetch(filePath)
        .then((response) => response.text())
        .then((content) => resolve(content))
        .catch((error) => reject(error));
    });
    