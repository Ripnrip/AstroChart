class AstroChart {
    constructor(options = {}) {
        const {
            elementId,
            width = 800,
            height = 800,
            margin = 120,
            padding = 30,
            symbolScale = 0.8,
            textSize = 10,
            strokeWidth = 1.5,
            planets = {},
            cusps = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
            animate = false,
            speed = 0.5,
            rotations = 2
        } = options;

        if (!window.astrochart) {
            throw new Error('astrochart.js must be loaded first');
        }

        const config = {
            MARGIN: margin,
            PADDING: padding,
            SYMBOL_SCALE: symbolScale,
            POINTS_TEXT_SIZE: textSize,
            POINTS_STROKE: strokeWidth
        };

        this.chart = new window.astrochart.Chart(elementId, width, height, config);
        this.planets = planets;
        this.cusps = cusps;
        this.animate = animate;
        this.speed = speed;
        this.maxRotations = rotations;
        this.angle = 0;
        this.rotations = 0;
        this.animationFrame = null;
        this.onComplete = null;

        this.init();
    }

    init() {
        const data = {
            planets: this.planets,
            cusps: this.cusps
        };
        this.radix = this.chart.radix(data);
        
        if (this.animate) {
            this.start();
        }
    }

    start() {
        this.update();
    }

    update = () => {
        if (this.animate) {
            this.angle = (this.angle + this.speed) % 360;
            if (this.angle < this.speed) {
                this.rotations++;
                if (this.rotations >= this.maxRotations) {
                    this.stop();
                    if (this.onComplete) this.onComplete();
                    return;
                }
            }

            // Update planet positions based on animation
            const animatedPlanets = {};
            Object.entries(this.planets).forEach(([planet, [position, ...rest]]) => {
                animatedPlanets[planet] = [(position + this.angle) % 360, ...rest];
            });

            const data = {
                planets: animatedPlanets,
                cusps: this.cusps
            };
            this.radix.transit(data);
            this.animationFrame = requestAnimationFrame(this.update);
        }
    }

    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    updatePositions(planets, cusps = null) {
        this.planets = planets;
        if (cusps) this.cusps = cusps;
        
        const data = {
            planets: this.planets,
            cusps: this.cusps
        };
        this.radix.transit(data);
    }

    setAnimationComplete(callback) {
        this.onComplete = callback;
    }

    destroy() {
        this.stop();
        // Add any cleanup needed
    }
} 