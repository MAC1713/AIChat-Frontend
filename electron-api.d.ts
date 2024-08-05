interface ElectronAPI {
    sendMessage: (message: string) => void
    receiveMessage: (callback: (message: any) => void) => void
    getAppVersion: () => Promise<string>
    openExternalLink: (url: string) => void
  }
  
interface Window {
electronAPI: ElectronAPI
}