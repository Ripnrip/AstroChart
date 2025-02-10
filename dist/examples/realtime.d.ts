export declare class RealtimeChart {
    private chart;
    private calculator;
    private animationFrame;
    constructor(elementId: string, width: number, height: number);
    private update;
    stop(): void;
}
