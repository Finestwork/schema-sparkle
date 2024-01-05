import { useFileStore } from '@stores/File';
import { useHistoryStore } from '@stores/History';
import { useTrackChange } from '@composables/History/useTrackChange';
import {
    resetEdgesActiveState,
    resetNodesActiveState,
} from '@utilities/CanvasHelper';
import { vueFlowKey } from '@symbols/VueFlow';
import { inject } from 'vue';
import type { TEdge, TNode } from '@stores/Canvas';

export function useSaveCanvas() {
    const historyStore = useHistoryStore();
    const fileStore = useFileStore();
    const vueFlow = inject(vueFlowKey);
    const { hasChanged } = useTrackChange();

    const saveCanvas = async () => {
        if (!vueFlow || (!hasChanged.value && fileStore.filePath.trim() !== ''))
            return;

        const SavedItems = historyStore.items[historyStore.currentIndex];
        const Contents = {
            edges: resetEdgesActiveState(
                SavedItems.payload.edges as Array<TEdge>,
            ),
            nodes: resetNodesActiveState(
                SavedItems.payload.nodes as Array<TNode>,
            ),
        };

        // If file is already saved, overwrite it
        if (fileStore.filePath.length <= 0) {
            const { filePath: FilePath, fileName: FileName } =
                await window.api.saveFile(JSON.stringify(Contents));

            fileStore.savedIndex = historyStore.currentIndex;
            fileStore.fileName = FileName;
            fileStore.filePath = FilePath;
        } else {
            await window.api.overwriteFile(
                JSON.stringify(Contents),
                JSON.stringify(fileStore.filePath),
            );
            fileStore.savedIndex = historyStore.currentIndex;
        }
    };

    const overwriteFileName = async (fileName: string) => {
        if (fileStore.filePath.trim() === '') return;

        // If file is already saved, overwrite it
        const Result = await window.api.overwriteFileName(
            fileStore.filePath,
            fileName,
        );

        if (Result.fileName && Result.filePath) {
            fileStore.fileName = Result.fileName;
            fileStore.filePath = Result.filePath;
        }
    };

    return {
        saveCanvas,
        overwriteFileName,
    };
}
