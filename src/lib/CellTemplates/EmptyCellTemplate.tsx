import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';

export interface EmptyCell extends Cell {
    type: ''
}

export class EmptyCellTemplate implements CellTemplate<EmptyCell> {

    getCompatibleCell(uncertainCell: Uncertain<EmptyCell>): Compatible<EmptyCell> {
        return { ...uncertainCell, text: '', value: NaN };
    }

    update(cell: Compatible<EmptyCell>, cellToMerge: UncertainCompatible<EmptyCell>): Compatible<EmptyCell> {
        // if (cellToMerge.type === '') {
        // }
        return this.getCompatibleCell({ ...cell, type: cellToMerge.type })
    }

    render(cell: Compatible<EmptyCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<EmptyCell>, commit: boolean) => void): React.ReactNode {
        return null;
    }
}
