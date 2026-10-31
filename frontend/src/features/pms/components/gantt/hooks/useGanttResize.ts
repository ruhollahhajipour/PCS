import {
    useCallback,
    useEffect,
    useRef
} from "react";

import type {
    PointerEvent as ReactPointerEvent
} from "react";

export interface UseGanttResizeOptions {
    rowHeight: number;
    setRowHeight: (value: number) => void;

    bottomPanelHeight: number;
    setBottomPanelHeight: (
        value: number
    ) => void;

    minRowHeight: number;
    maxRowHeight: number;

    defaultRowHeight?: number;

    minBottomPanelHeight: number;
    maxBottomPanelHeight: number;

    defaultBottomPanelHeight?: number;
}

interface UseGanttResizeResult {
    decreaseRowHeight: () => void;
    increaseRowHeight: () => void;
    resetRowHeight: () => void;

    startRowResize: (
        event: ReactPointerEvent
    ) => void;

    startBottomResize: (
        event: ReactPointerEvent
    ) => void;
}

function clamp(
    value: number,
    min: number,
    max: number
): number {
    return Math.max(
        min,
        Math.min(max, value)
    );
}

export function useGanttResize({
    rowHeight,
    setRowHeight,
    bottomPanelHeight,
    setBottomPanelHeight,
    minRowHeight,
    maxRowHeight,
    defaultRowHeight = 30,
    minBottomPanelHeight,
    maxBottomPanelHeight,
    defaultBottomPanelHeight = 176
}: UseGanttResizeOptions): UseGanttResizeResult {
    const rowResizeActive =
        useRef(false);

    const rowResizeStartY =
        useRef(0);

    const rowResizeInitialHeight =
        useRef(rowHeight);

    const bottomResizeActive =
        useRef(false);

    const bottomResizeStartY =
        useRef(0);

    const bottomResizeInitialHeight =
        useRef(bottomPanelHeight);

    const stopResize =
        useCallback(() => {
            rowResizeActive.current = false;
            bottomResizeActive.current = false;

            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }, []);

    useEffect(() => {
        const handlePointerMove = (
            event: PointerEvent
        ) => {
            if (
                rowResizeActive.current
            ) {
                const delta =
                    event.clientY -
                    rowResizeStartY.current;

                const nextHeight =
                    clamp(
                        rowResizeInitialHeight.current +
                            delta,
                        minRowHeight,
                        maxRowHeight
                    );

                setRowHeight(nextHeight);

                return;
            }

            if (
                bottomResizeActive.current
            ) {
                const delta =
                    event.clientY -
                    bottomResizeStartY.current;

                const nextHeight =
                    clamp(
                        bottomResizeInitialHeight.current -
                            delta,
                        minBottomPanelHeight,
                        maxBottomPanelHeight
                    );

                setBottomPanelHeight(
                    nextHeight
                );
            }
        };

        const handlePointerUp = () => {
            stopResize();
        };

        document.addEventListener(
            "pointermove",
            handlePointerMove
        );

        document.addEventListener(
            "pointerup",
            handlePointerUp
        );

        document.addEventListener(
            "pointercancel",
            handlePointerUp
        );

        return () => {
            document.removeEventListener(
                "pointermove",
                handlePointerMove
            );

            document.removeEventListener(
                "pointerup",
                handlePointerUp
            );

            document.removeEventListener(
                "pointercancel",
                handlePointerUp
            );
        };
    }, [
        maxBottomPanelHeight,
        maxRowHeight,
        minBottomPanelHeight,
        minRowHeight,
        setBottomPanelHeight,
        setRowHeight,
        stopResize
    ]);

    const startRowResize =
        useCallback(
            (
                event: ReactPointerEvent
            ) => {
                if (
                    event.button !== 0
                ) {
                    return;
                }

                rowResizeActive.current = true;
                rowResizeStartY.current =
                    event.clientY;
                rowResizeInitialHeight.current =
                    rowHeight;

                document.body.style.cursor =
                    "row-resize";

                document.body.style.userSelect =
                    "none";

                event.currentTarget.setPointerCapture?.(
                    event.pointerId
                );
            },
            [rowHeight]
        );

    const startBottomResize =
        useCallback(
            (
                event: ReactPointerEvent
            ) => {
                if (
                    event.button !== 0
                ) {
                    return;
                }

                bottomResizeActive.current =
                    true;

                bottomResizeStartY.current =
                    event.clientY;

                bottomResizeInitialHeight.current =
                    bottomPanelHeight;

                document.body.style.cursor =
                    "row-resize";

                document.body.style.userSelect =
                    "none";

                event.currentTarget.setPointerCapture?.(
                    event.pointerId
                );
            },
            [bottomPanelHeight]
        );

    const decreaseRowHeight =
        useCallback(() => {
            setRowHeight(
                clamp(
                    rowHeight - 2,
                    minRowHeight,
                    maxRowHeight
                )
            );
        }, [
            maxRowHeight,
            minRowHeight,
            rowHeight,
            setRowHeight
        ]);

    const increaseRowHeight =
        useCallback(() => {
            setRowHeight(
                clamp(
                    rowHeight + 2,
                    minRowHeight,
                    maxRowHeight
                )
            );
        }, [
            maxRowHeight,
            minRowHeight,
            rowHeight,
            setRowHeight
        ]);

    const resetRowHeight =
        useCallback(() => {
            setRowHeight(
                clamp(
                    defaultRowHeight,
                    minRowHeight,
                    maxRowHeight
                )
            );
        }, [
            defaultRowHeight,
            maxRowHeight,
            minRowHeight,
            setRowHeight
        ]);

    /*
     * Keep the default bottom-panel value intentionally available
     * for future reset/restore behavior without forcing a state
     * update from inside this hook.
     */
    void defaultBottomPanelHeight;

    return {
        decreaseRowHeight,
        increaseRowHeight,
        resetRowHeight,
        startRowResize,
        startBottomResize
    };
}

export default useGanttResize;