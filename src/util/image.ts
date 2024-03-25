export const generateBase64FromImage = (
  imageFile: File
): Promise<string | ArrayBuffer> => {
  const reader = new FileReader();
  const promise = new Promise<string | ArrayBuffer>((resolve, reject) => {
    reader.onload = (e) => {
      if (e.target?.result !== undefined) {
        resolve(e.target.result as string | ArrayBuffer);
      } else {
        reject(new Error('File read resulted in undefined'));
      }
    };
    reader.onerror = (err) => reject(err);
  });

  reader.readAsDataURL(imageFile);
  return promise;
};
