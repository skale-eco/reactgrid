import * as React from 'react';
import { GridRendererProps } from '../Model/InternalModel';
import { HiddenElement } from './HiddenElement';
import { ErrorBoundary } from './ErrorBoundary';
import { useReactGridState } from './StateProvider';

export const GridRenderer: React.FC<GridRendererProps> = ({ eventHandlers, children }) => {
    const { cellMatrix, props } = useReactGridState();
    const sharedStyles = {
        width: props?.enableFullWidthHeader ? '100%' : cellMatrix.width,
        height: cellMatrix.height,
    };

    const defaultActions = !props?.disabledTable
    ? {
        onKeyDown: eventHandlers.keyDownHandler,
        onKeyUp: eventHandlers.keyUpHandler,
        onPointerDown: eventHandlers.pointerDownHandler,
        onPasteCapture: eventHandlers.pasteCaptureHandler,
        onPaste: eventHandlers.pasteHandler,
        onCopy: eventHandlers.copyHandler,
        onCut: eventHandlers.cutHandler,
        onBlur: eventHandlers.blurHandler,
      }
    : {};

    return (
        <ErrorBoundary>
            <div
                className={`reactgrid ${props?.disabledTable ? "disabled" : ""}`}
                style={{
                    position: 'relative',
                    ...sharedStyles,
                }}
                ref={eventHandlers.reactgridRefHandler}
            >
                <div
                    className="reactgrid-content"
                    // onKeyDown={eventHandlers.keyDownHandler}
                    // onKeyUp={eventHandlers.keyUpHandler}
                    // onPointerDown={eventHandlers.pointerDownHandler}
                    // onPasteCapture={eventHandlers.pasteCaptureHandler}
                    // onPaste={eventHandlers.pasteHandler}
                    // onCopy={eventHandlers.copyHandler}
                    // onCut={eventHandlers.cutHandler}
                    // onBlur={eventHandlers.blurHandler}
                    {...defaultActions}
                    style={sharedStyles}
                >
                    {children}
                    <HiddenElement hiddenElementRefHandler={eventHandlers.hiddenElementRefHandler} />
                </div>
            </div>
        </ErrorBoundary>
    );
};
