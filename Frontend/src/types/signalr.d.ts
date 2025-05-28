// If you installed @types/jquery and @types/signalr, you don't need this
// Otherwise, use this declaration
interface SignalR {
  hubConnection(url?: string): any;
}

interface JQueryStatic {
  hubConnection: (url?: string) => any;
}

declare const $: JQueryStatic;