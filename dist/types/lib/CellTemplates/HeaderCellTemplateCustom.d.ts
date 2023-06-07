import * as React from "react";
import { Cell, CellStyle, CellTemplate, Compatible, Span, Uncertain } from "../Model/PublicModel";
interface HeaderCell extends Cell, Span {
    type: "header";
    text: string;
    required?: boolean;
}
export declare class HeaderCellTemplateCustom implements CellTemplate<HeaderCell> {
    getCompatibleCell(uncertainCell: Uncertain<HeaderCell>): Compatible<HeaderCell>;
    render(cell: Compatible<HeaderCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<HeaderCell>, commit: boolean) => void): React.ReactNode;
    isFocusable: (cell: Compatible<HeaderCell>) => boolean;
    getClassName(cell: Compatible<HeaderCell>, isInEditMode: boolean): string;
    getStyle: (cell: Compatible<HeaderCell>) => CellStyle;
}
export {};
