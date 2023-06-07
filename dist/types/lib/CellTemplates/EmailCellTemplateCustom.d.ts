import * as React from "react";
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from "../Model/PublicModel";
interface EmailCell extends Cell {
    type: "email";
    text: string;
    validator?: (text: string) => React.ReactNode;
    renderer?: (text: string) => React.ReactNode;
}
export declare class EmailCellTemplateCustom implements CellTemplate<EmailCell> {
    getCompatibleCell(uncertainCell: Uncertain<EmailCell>): Compatible<EmailCell>;
    handleKeyDown(cell: Compatible<EmailCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<EmailCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<EmailCell>, cellToMerge: UncertainCompatible<EmailCell>): Compatible<EmailCell>;
    getClassName(cell: Compatible<EmailCell>, isInEditMode: boolean): string;
    render(cell: Compatible<EmailCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<EmailCell>, commit: boolean) => void): React.ReactNode;
}
export {};
