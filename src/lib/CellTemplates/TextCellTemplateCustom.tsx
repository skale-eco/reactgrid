import * as React from "react";

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { isAlphaNumericKey, isNavigationKey } from "./keyCodeCheckings";
import { getCellProperty } from "../Functions/getCellProperty";
import { keyCodes } from "../Functions/keyCodes";
import {
  Cell,
  CellTemplate,
  Compatible,
  Uncertain,
  UncertainCompatible,
} from "../Model/PublicModel";
import { getCharFromKeyCode } from "./getCharFromKeyCode";

interface TextCell extends Cell {
  type: "text";
  text: string;
  placeholder?: string;
  validator?: (text: string) => React.ReactNode;
  renderer?: (text: string) => React.ReactNode;
  getValueFromEvent?: (value: string) => string;
}

export class TextCellTemplateCustom implements CellTemplate<TextCell> {
  getCompatibleCell(uncertainCell: Uncertain<TextCell>): Compatible<TextCell> {
    const text = getCellProperty(uncertainCell, "text", "string");
    let placeholder: string | undefined;
    try {
      placeholder = getCellProperty(uncertainCell, "placeholder", "string");
    } catch {
      placeholder = "";
    }
    const value = parseFloat(text); // TODO more advanced parsing for all text based cells
    return { ...uncertainCell, text, value, placeholder };
  }

  update(
    cell: Compatible<TextCell>,
    cellToMerge: UncertainCompatible<TextCell>
  ): Compatible<TextCell> {
    return this.getCompatibleCell({
      ...cell,
      text: cell.getValueFromEvent
        ? cell.getValueFromEvent(cellToMerge.text)
        : cellToMerge.text,
      placeholder: cellToMerge.placeholder,
    });
  }

  handleKeyDown(
    cell: Compatible<TextCell>,
    keyCode: number,
    ctrl: boolean,
    shift: boolean,
    alt: boolean
  ): { cell: Compatible<TextCell>; enableEditMode: boolean } {
    const char = getCharFromKeyCode(keyCode, shift);
    if (
      !ctrl &&
      !alt &&
      isAlphaNumericKey(keyCode) &&
      !(shift && keyCode === keyCodes.SPACE)
    )
      return {
        cell: this.getCompatibleCell({
          ...cell,
          text: shift ? char : char.toLowerCase(),
        }),
        enableEditMode: true,
      };
    return {
      cell,
      enableEditMode:
        keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER,
    };
  }

  getClassName(cell: Compatible<TextCell>, isInEditMode: boolean): string {
    const errorMessage = cell.validator ? cell.validator(cell.text) : null;
    const className = cell.className ? cell.className : "";
    return `${!errorMessage ? "valid" : "invalid"} ${
      cell.placeholder && cell.text === "" ? "placeholder" : ""
    } ${className}`;
  }

  render(
    cell: Compatible<TextCell>,
    isInEditMode: boolean,
    onCellChanged: (cell: Compatible<TextCell>, commit: boolean) => void
  ): React.ReactNode {
    if (!isInEditMode) {
      const errorMessage = cell.validator ? cell.validator(cell.text) : null;
      const textToDisplay = cell.text || cell.placeholder || "";
      return (
        <>
          {errorMessage}
          {cell.renderer ? cell.renderer(textToDisplay) : textToDisplay}
        </>
      );
    }

    return (
      <input
        ref={(input) => {
          if (input) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
          }
        }}
        defaultValue={cell.text}
        onChange={(e) =>
          onCellChanged(
            this.getCompatibleCell({ ...cell, text: e.currentTarget.value }),
            false
          )
        }
        onBlur={(e) =>
          onCellChanged(
            this.getCompatibleCell({ ...cell, text: e.currentTarget.value }),
            (e as any).view?.event?.keyCode !== keyCodes.ESCAPE
          )
        }
        onCopy={(e) => e.stopPropagation()}
        onCut={(e) => e.stopPropagation()}
        onPaste={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        placeholder={cell.placeholder}
        onKeyDown={(e) => {
          if (isAlphaNumericKey(e.keyCode) || isNavigationKey(e.keyCode))
            e.stopPropagation();
        }}
      />
    );
  }
}
