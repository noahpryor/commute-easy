

export function fetchInBackground(url: string, options: any) {
  return browser.runtime.sendMessage({
    action: "fetch",
    data: {url, options}
  })
}

interface Message {
  action: string;
  data: any;
}
export function handleBackgroundFetch(message: Message) {
  const {action, data} = message
  if(action === "fetch") {
    const {url, options} = data
    return fetchInBackground(url, options).then(request => request.json())
  }
}
