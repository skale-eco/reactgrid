import * as React from "react";
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from "../Model/PublicModel";
interface NumberCell extends Cell {
    type: "number";
    value: number;
    format?: Intl.NumberFormat;
    validator?: (text: number) => React.ReactNode;
    renderer?: (text: string) => React.ReactNode;
    nanToZero?: boolean;
    hideZero?: boolean;
    getValueFromEvent?: (value: number) => number;
}
export declare class NumberCellTemplateCustom implements CellTemplate<NumberCell> {
    getCompatibleCell(uncertainCell: Uncertain<NumberCell>): Compatible<NumberCell>;
    handleKeyDown(cell: Compatible<NumberCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<NumberCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<NumberCell>, cellToMerge: UncertainCompatible<NumberCell>): Compatible<NumberCell>;
    private getTextFromCharCode;
    getClassName(cell: Compatible<NumberCell>, isInEditMode: boolean): string;
    render(cell: Compatible<NumberCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<NumberCell>, commit: boolean) => void): React.ReactNode;
}
export {};
