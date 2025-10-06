import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import annotationPlugin from 'chartjs-plugin-annotation';
import { getIndexByHeat, getColorByIndex, formatFullTime } from "../../utils/heatUtils";

Chart.register(annotationPlugin);

const MIN = 0;
const MAX = 60;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function HeatGauge({ heatIndex, timestamp }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const time = formatFullTime(timestamp);

        // const value = rand(MIN, MAX);

        const data = {
            datasets: [{
                data: [heatIndex, MAX - heatIndex],
                backgroundColor(ctx) {
                    if (ctx.type !== 'data') {
                        return;
                    }
                    if (ctx.dataIndex === 1) {
                        return '#eaeaeaff';
                    }
                    return getColorByIndex(getIndexByHeat(ctx.raw));
                },
                borderWidth: 0,
                borderRadius: 5
            }]
        };

        const annotation = {
            type: 'doughnutLabel',
            content: ({ chart }) => [
                chart.data.datasets[0].data[0].toFixed(1) + '°C',
                `${ time }`,
            ],
            position: {
                y: 'center'
            },
            font: [{ size: 90, weight: 'bold' }, { size: 50 }],
            color: ({ chart }) => [getColorByIndex(getIndexByHeat(chart.data.datasets[0].data[0])), 'grey']
        };

        const config = {
            type: 'doughnut',
            data,
            options: {
                aspectRatio: 2,
                circumference: 220,
                rotation: -110,
                cutout: '60%',
                plugins: {
                    tooltip: {
                        enabled: false
                    },
                    annotation: {
                        annotations: {
                            annotation
                        }
                    }
                }
            }
        };

        // Destroy the previous chart instance if it exists
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create the new chart and store its instance
        const canvasCtx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(canvasCtx, config);

        // The cleanup function will run when the component unmounts
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };

    }, [heatIndex, timestamp]); // re-run effect if these props change

    return (
        <div className="canvas-container">
            <canvas className="gauge-canvas" ref={ chartRef }></canvas>
        </div>
    )
}

export default HeatGauge;