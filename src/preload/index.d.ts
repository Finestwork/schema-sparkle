import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
    interface Window {
        electron: ElectronAPI;
        api: {
            toggleDarkMode(isDarkMode: boolean): void;
            saveFile(contents: string): void;
            overwriteFileName(currentFilePath: string, fileName: string): void;
            overwriteFile(contents: string, filePath: string): void;
            openFile(): void;
        };
    }
}
