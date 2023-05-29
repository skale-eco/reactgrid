import React, { FC } from "react";
import Select from "react-select";

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from "../Functions/getCellProperty";
import {
  Cell,
  CellTemplate,
  Compatible,
  Span,
  Uncertain,
  UncertainCompatible,
} from "../Model/PublicModel";
import { isAlphaNumericKey } from "./keyCodeCheckings";
import { keyCodes } from "../Functions/keyCodes";

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

export class DropdownCellTemplateCustom implements CellTemplate<DropdownCell> {
  getCompatibleCell(
    uncertainCell: Uncertain<DropdownCell>
  ): Compatible<DropdownCell> {
    const options = getCellProperty(uncertainCell, "options", "object");
    const text = getCellProperty(uncertainCell, "text", "string");
    const value = text ? parseFloat(text) : NaN;

    return {
      ...uncertainCell,
      text,
      value: value,
      options,
    };
  }

  update(
    cell: Compatible<DropdownCell>,
    cellToMerge: UncertainCompatible<DropdownCell>
  ): Compatible<DropdownCell> {
    return this.getCompatibleCell({
      ...cell,
      text: cellToMerge.text,
    });
  }

  getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean): string {
    return `${cell.className ? cell.className : ""}`;
  }

  handleKeyDown(
    cell: Compatible<DropdownCell>,
    keyCode: number,
    ctrl: boolean,
    shift: boolean,
    alt: boolean
  ): { cell: Compatible<DropdownCell>; enableEditMode: boolean } {
    if (
      !ctrl &&
      !alt &&
      isAlphaNumericKey(keyCode) &&
      !(shift && keyCode === keyCodes.SPACE)
    ) {
      return {
        cell,
        enableEditMode: true,
      };
    }
    return {
      cell,
      enableEditMode:
        keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER,
    };
  }

  render(
    cell: Compatible<DropdownCell>,
    isInEditMode: boolean,
    onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void
  ): React.ReactNode {
    if (!isInEditMode) {
      const textToDisplay =
        cell.options.find((obj) => obj.value === cell.text)?.label || "";
      return cell?.renderer ? (
        cell.renderer(textToDisplay)
      ) : (
        <div className="select-box">
          <div className="select-box__current">
            <span>{textToDisplay}</span>
          </div>
          <div className="select-box__icon">
            <span />
            <svg height="20" width="20" viewBox="0 0 20 20">
              <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
            </svg>
          </div>
        </div>
      );
    }
    return (
      <SelectInput
        onCellChanged={(cell) =>
          onCellChanged(this.getCompatibleCell(cell), true)
        }
        cell={cell}
        isInEditMode={isInEditMode}
      />
    );
  }
}

interface SIProps {
  onCellChanged: (...args: any[]) => void;
  cell: Record<string, any>;
  isInEditMode?: boolean;
}

const SelectInput: FC<SIProps> = ({
  onCellChanged,
  cell,
  isInEditMode = false,
}) => {
  return (
    <div style={{ width: "100%" }} onPointerDown={(e) => e.stopPropagation()}>
      <Select
        isSearchable={true}
        blurInputOnSelect={true}
        menuIsOpen={isInEditMode}
        onChange={(e) =>
          onCellChanged({
            ...cell,
            text: (e as IOption).value,
          })
        }
        defaultValue={cell.options.find((obj: any) => obj.value === cell.text)}
        placeholder={cell.placeholder || ''}
        isDisabled={cell.isDisabled || false}
        options={cell.options}
        onKeyDown={(e) => e.stopPropagation()}
        styles={{
          container: (provided) => ({
            ...provided,
            width: "100%",
            height: "100%",
          }),
          control: (provided) => ({
            ...provided,
            border: "none",
            borderColor: "transparent",
            minHeight: "25px",
            background: "transparent",
            boxShadow: "none",
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            paddingTop: "0px",
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            padding: "0px 4px",
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "inherit",
          }),
          indicatorSeparator: (provided) => ({
            ...provided,
            marginTop: "4px",
            marginBottom: "4px",
          }),
          input: (provided) => ({
            ...provided,
            padding: 0,
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: "0 8px",
          }),
          placeholder: (base) => ({
            ...base,
          }),
        }}
      />
    </div>
  );
};
