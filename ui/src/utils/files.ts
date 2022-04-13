export const downloadExternalFile = async (url: string, filename?: string) => {
  const file = await fetch(url);
  const blob = await file.blob();
  const href = await URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  if (filename) {
    link.download = filename;
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
