import * as React from "react";

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from "../Functions/getCellProperty";
import { keyCodes } from "../Functions/keyCodes";
import {
  Cell,
  CellTemplate,
  Compatible,
  Uncertain,
} from "../Model/PublicModel";

interface ButtonCell extends Cell {
  type: "button";
  text: string;
  renderer?: (text: string) => React.ReactNode;
  callback?: (e: any) => void;
}

export class ButtonCellTemplate implements CellTemplate<ButtonCell> {
  getCompatibleCell(
    uncertainCell: Uncertain<ButtonCell>
  ): Compatible<ButtonCell> {
    const text = getCellProperty(uncertainCell, "text", "string");
    const value = NaN;
    return {
      ...uncertainCell,
      text,
      value,
    };
  }

  getClassName(cell: Compatible<ButtonCell>): string {
    return cell.className ? cell.className : "";
  }

  handleKeyDown(
    cell: Compatible<ButtonCell>,
    keyCode: number,
    ctrl: boolean,
    shift: boolean,
    alt: boolean
  ): { cell: Compatible<ButtonCell>; enableEditMode: boolean } {
    if (!shift && (keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER))
      return {
        cell,
        enableEditMode: false,
      };
    return { cell, enableEditMode: false };
  }

  render(
    cell: Compatible<ButtonCell>,
    isInEditMode: boolean,
    onCellChanged: (cell: Compatible<ButtonCell>, commit: boolean) => void
  ): React.ReactNode {
    const textToDisplay = cell.text || "";
    return (
      <button
        className="button-box"
        onClick={(event) =>
          typeof cell.callback === "function" && cell.callback(event)
        }
      >
        {cell?.renderer ? cell.renderer(textToDisplay) : textToDisplay}
      </button>
    );
  }
}
