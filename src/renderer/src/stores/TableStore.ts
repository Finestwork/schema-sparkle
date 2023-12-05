import { TestEdges, TestElements } from '@renderer/stores/dummy/TableStoreTest';
import type { Edge, Node } from '@vue-flow/core';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export type TTableColumnCreation = {
    name: string;
    type: string;
    isNull: boolean;
    length: '';
    keyConstraint: 'PK' | 'FK' | '';
};
export type TTableColumn = TTableColumnCreation & {
    id: number;
};

export type TTableData = {
    table: {
        name: string;
        columns: TTableColumn[];
    };
};

export type TEdgeDataObject = {
    id: string;
    column: string;
    table: string;
};
export type TEdgeData = {
    referenced: TEdgeDataObject;
    referencing: TEdgeDataObject;
};

export const useTableStore = defineStore('tableStore', {
    state() {
        return {
            elements: TestElements as (Node & { data: TTableData })[],
            edges: TestEdges as (Edge & { data: TEdgeData })[],
            currentActiveNode: {} as (Node & { data: TTableData }[]) | Record<string, never>,
            currentActiveEdges: [] as (Edge & { data: TEdgeData })[],
            currentActiveEdgeIndex: -1,
        };
    },
    actions: {
        addNewEdge(
            referenced: { id: string; column: string; table: string },
            referencing: { id: string; column: string; table: string },
        ) {
            const Edge = {
                id: uuidv4(),
                source: referenced.id,
                target: referencing.id,
                data: {
                    referenced: {
                        id: referenced.id,
                        column: referenced.column,
                        table: referenced.table,
                    },
                    referencing: {
                        id: referencing.id,
                        column: referencing.column,
                        table: referencing.table,
                    },
                },
            };
            this.edges = [...this.edges, Edge];
        },
        updateNewEdge(
            edgeId: string,
            referenced: { id: string; column: string; table: string },
            referencing: { id: string; column: string; table: string },
        ) {
            const NewEdgeObject = {
                id: uuidv4(),
                source: referenced.id,
                target: referencing.id,
                data: {
                    referenced: {
                        id: referenced.id,
                        column: referenced.column,
                        table: referenced.table,
                    },
                    referencing: {
                        id: referencing.id,
                        column: referencing.column,
                        table: referencing.table,
                    },
                },
            };
            const Index = this.edges.findIndex((edge) => edge.id === edgeId);
            if (Index === -1) return;
            this.edges.splice(Index, 1);
            this.edges = [...this.edges, NewEdgeObject];
        },
        deleteEdge(edgeId: string) {
            const Index = this.edges.findIndex((edge) => edge.id === edgeId);
            if (Index === -1) return;
            this.edges.splice(Index, 1);
        },
        onActiveNodeCreateColumn(columnData: TTableColumnCreation) {
            const Columns = this.currentActiveNode.data.table.columns;
            const ColumnData = {
                id: uuidv4(),
                name: columnData.name,
                type: columnData.type,
                isNull: columnData.isNull,
                length: columnData.length,
                keyConstraint: columnData.keyConstraint,
            };
            this.currentActiveNode.data.table.columns = [...Columns, Object.assign({}, ColumnData)];
        },
        updateTableColumn(columnData: TTableColumnCreation, index: number) {
            const Columns = this.currentActiveNode.data.table.columns;
            const CurrentColumn = Columns[index];
            Columns[index] = Object.assign(CurrentColumn, {
                name: columnData.name,
                type: columnData.type,
                isNull: columnData.isNull,
                length: columnData.length,
                keyConstraint: columnData.keyConstraint,
            });
        },
    },
    getters: {
        hasActiveNode(state) {
            return Object.keys(state.currentActiveNode).length !== 0;
        },
        activeNodeHasColumns(state) {
            if (!this.hasActiveNode) {
                return false;
            }

            const Columns = state.currentActiveNode.data.table.columns;
            return Columns.length !== 0;
        },
        getAttributesOfCurrentActiveNode(state) {
            const Columns = state.currentActiveNode.data.table.columns;
            return Columns.map((column) => column.name);
        },
        getAllColumnNames(state) {
            return state.elements.map((element) => ({
                id: element.id,
                name: element.data.table.name,
            }));
        },
    },
});
