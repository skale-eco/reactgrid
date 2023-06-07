import React from "react";
import { Cell, CellTemplate, Compatible, Span, Uncertain, UncertainCompatible } from "../Model/PublicModel";
interface IOption {
    value: string;
    label: string;
}
interface DropdownCell extends Cell, Span {
    type: "dropdown";
    options: IOption[];
    text: string;
    renderer?: (text: string) => React.ReactNode;
}
export declare class DropdownCellTemplateCustom implements CellTemplate<DropdownCell> {
    getCompatibleCell(uncertainCell: Uncertain<DropdownCell>): Compatible<DropdownCell>;
    update(cell: Compatible<DropdownCell>, cellToMerge: UncertainCompatible<DropdownCell>): Compatible<DropdownCell>;
    getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean): string;
    handleKeyDown(cell: Compatible<DropdownCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<DropdownCell>;
        enableEditMode: boolean;
    };
    render(cell: Compatible<DropdownCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void): React.ReactNode;
}
export {};
