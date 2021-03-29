import * as React from 'react';
/* eslint-disable */

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { getCharFromKeyCode } from './getCharFromKeyCode';
import { isAlphaNumericKey } from './keyCodeCheckings';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
import { keyCodes } from '../Functions/keyCodes';

import Select, { OptionProps, MenuProps } from 'react-select';

export type OptionType = {
    label: string;
    value: string;
}

export interface DropdownCell extends Cell {
    type: 'dropdown';
    selectedValue?: string;
    values: OptionType[];
    isDisabled?: boolean;
    isOpen?: boolean;
    inputValue?: string;
}

export class DropdownCellTemplate implements CellTemplate<DropdownCell> {

    getCompatibleCell(uncertainCell: Uncertain<DropdownCell>): Compatible<DropdownCell> {
        let selectedValue: string | undefined;
        try {
            selectedValue = getCellProperty(uncertainCell, 'selectedValue', 'string')
        } catch {
            selectedValue = undefined;
        }
        const values = getCellProperty(uncertainCell, 'values', 'object');
        const value = selectedValue ? parseFloat(selectedValue) : NaN;
        let isDisabled = true;
        try {
            isDisabled = getCellProperty(uncertainCell, 'isDisabled', 'boolean');
        } catch {
            isDisabled = false;
        }
        let inputValue: string | undefined;
        try {
            inputValue = getCellProperty(uncertainCell, 'inputValue', 'string');
        } catch {
            inputValue = undefined;
        }
        let isOpen: boolean;
        try {
            isOpen = getCellProperty(uncertainCell, 'isOpen', 'boolean');
        } catch {
            isOpen = false;
        }
        const text = selectedValue || '';
        return { ...uncertainCell, selectedValue, text, value, values, isDisabled, isOpen, inputValue };
    }

    update(cell: Compatible<DropdownCell>, cellToMerge: UncertainCompatible<DropdownCell>): Compatible<DropdownCell> {
        return this.getCompatibleCell({ ...cell, selectedValue: cellToMerge.selectedValue, isOpen: cellToMerge.isOpen, inputValue: cellToMerge.inputValue });
    }

    getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean): string {
        const isOpen = cell.isOpen ? 'open' : 'closed';
        return `${cell.className ? cell.className : ''}${isOpen}`;
    }

    handleKeyDown(cell: Compatible<DropdownCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<DropdownCell>, enableEditMode: boolean } {
        if ((keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER) && !shift) {
            return { cell: this.getCompatibleCell({ ...cell, isOpen: !cell.isOpen }), enableEditMode: false };
        }
        const char = getCharFromKeyCode(keyCode, shift);
        if (!ctrl && !alt && isAlphaNumericKey(keyCode))
            return { cell: this.getCompatibleCell({ ...cell, inputValue: shift ? char : char.toLowerCase(), isOpen: !cell.isOpen }), enableEditMode: false }
        return { cell, enableEditMode: false };
    }

    render(
        cell: Compatible<DropdownCell>,
        isInEditMode: boolean,
        onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void
    ): React.ReactNode {
        // TODO create custom hook - useDropdown
        const { inputValue: iv, values, isOpen, isDisabled, selectedValue } = cell;

        //eslint-disable-next-line
        const selectRef = React.useRef<any>(null);
        //eslint-disable-next-line
        const [inputValue, setInputValue] = React.useState<string | undefined>(iv);
        //eslint-disable-next-line
        React.useEffect(() => {
            if (isOpen && selectRef.current) {
                selectRef.current.focus();
                setInputValue(iv);
            }
        }, [isOpen, iv]);

        //eslint-disable-next-line
        const call = React.useCallback(() => {
            onCellChanged(this.getCompatibleCell({ ...cell, isOpen: true }), true)
        }, [cell, onCellChanged])

        //eslint-disable-next-line
        const onChange = React.useCallback(() => {
            onCellChanged(this.getCompatibleCell({ ...cell, isOpen: !isOpen, inputValue: undefined }), true)
        }, [onCellChanged, isOpen, cell]);

        //eslint-disable-next-line
        const onInputChange = React.useCallback(e => setInputValue(e), []);

        return (
            <div
                style={{ width: '100%' }}
                onPointerDown={call}
            >
                <A iv={iv} inputValue={inputValue} selectRef={selectRef} isOpen={isOpen} onChange={onChange} call={call}
                    values={values} selectedValue={selectedValue} isDisabled={isDisabled} onInputChange={onInputChange}></A>
            </div>
        );
    }
}

const A = React.memo<CProps>(({ iv, inputValue, selectRef, isOpen, onChange, call, values, selectedValue, isDisabled, onInputChange }) => {
    return <C
        iv={iv} inputValue={inputValue} selectRef={selectRef} isOpen={isOpen} onChange={onChange} call={call}
        values={values} selectedValue={selectedValue} isDisabled={isDisabled} onInputChange={onInputChange}
    />
}, (prev, next) => {
    // return false;
    return prev.isOpen === next.isOpen
        // || prev.call === next.call
        // || prev.inputValue === next.inputValue
        // || prev.isDisabled === next.isDisabled
        // || prev.iv === next.iv
        // || prev.onChange === next.onChange
        // || prev.onInputChange === next.onInputChange
        // || prev.selectRef === next.selectRef
        || prev.selectedValue === next.selectedValue
    // || prev.values === next.values;
});

interface CProps {
    iv: string | undefined;
    inputValue: string | undefined;
    selectRef: React.MutableRefObject<any>;
    isOpen: boolean | undefined;
    onChange: (...ars: any) => any,
    call: (...ars: any) => any,
    values: any[],
    selectedValue: string | undefined,
    isDisabled: boolean | undefined;
    onInputChange: (...ars: any) => any,
}

const C: React.FC<CProps> = ({ iv, inputValue, selectRef, isOpen, onChange, call, values, selectedValue, isDisabled, onInputChange }) => {
    //eslint-disable-next-line
    const styles = useStyles();

    return <Select
        {...(iv && {
            inputValue,
            defaultInputValue: inputValue,
            onInputChange,
        })}
        isSearchable={true}
        ref={selectRef}
        {...(isOpen !== undefined && { menuIsOpen: isOpen })}
        onMenuClose={onChange}
        onMenuOpen={call}
        onChange={onChange}
        blurInputOnSelect={true}
        defaultValue={values.find(val => val.value === selectedValue)}
        isDisabled={isDisabled}
        options={values}
        onKeyDown={e => e.stopPropagation()}
        components={{
            Option: CustomOption,
            Menu: CustomMenu,
        }}
        styles={styles}
    />
}

const useStyles = () => {

    //eslint-disable-next-line
    const container = React.useCallback((provided) => ({
        ...provided,
        width: '100%',
        height: '100%',
    }), []);

    //eslint-disable-next-line
    const control = React.useCallback((provided) => ({
        ...provided,
        border: 'none',
        borderColor: 'transparent',
        minHeight: '25px',
        background: 'transparent',
        boxShadow: 'none',
    }), []);

    //eslint-disable-next-line
    const indicatorsContainer = React.useCallback((provided) => ({
        ...provided,
        paddingTop: '0px',
    }), []);

    //eslint-disable-next-line
    const dropdownIndicator = React.useCallback((provided) => ({
        ...provided,
        padding: '0px 4px',
    }), []);

    //eslint-disable-next-line
    const input = React.useCallback((provided) => ({
        ...provided,
        padding: 0,
    }), []);

    //eslint-disable-next-line
    const valueContainer = React.useCallback((provided) => ({
        ...provided,
        padding: '0 8px',
    }), []);

    //eslint-disable-next-line
    const singleValue = React.useCallback((provided) => ({
        ...provided,
        color: 'inherit'
    }), []);

    //eslint-disable-next-line
    const indicatorSeparator = React.useCallback((provided) => ({
        ...provided,
        marginTop: '4px',
        marginBottom: '4px',
    }), []);

    return {
        container,
        control,
        indicatorsContainer,
        dropdownIndicator,
        singleValue,
        indicatorSeparator,
        input,
        valueContainer,
    }

}

const CustomOption: React.FC<OptionProps<OptionType, false>> = ({ innerProps, label, isSelected, isFocused }) => (
    <div
        {...innerProps}
        onPointerDown={e => e.stopPropagation()}
        className={`dropdown-option${isSelected ? ' selected' : ''}${isFocused ? ' focused' : ''}`}
    >
        {label}
    </div>
);

const CustomMenu: React.FC<MenuProps<OptionType, false>> = ({ innerProps, children }) => (
    <div {...innerProps} className='dropdown-menu'>{children}</div>
);
