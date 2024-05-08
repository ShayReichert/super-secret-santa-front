export function extractUrls(text: string): { newText: string; urls: string[] } {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let urls: string[] = [];
  let newText = text.replace(urlRegex, (url) => {
    urls.push(url);
    return "";
  });

  return { newText: newText.trim(), urls };
}
