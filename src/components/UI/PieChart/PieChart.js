import React, { useEffect, useRef, useState } from 'react';
import * as d3 from "d3";
import { legendColor } from 'd3-svg-legend';
import './PieChart.css';

const PieChart = ({
    data,
    title,
    pieRadius,
    chartPadding,
    legendVerticalOffset,
    legendHorizontalOffset,
    colours,
    decimals
}) => {
    const canvasWidth = (pieRadius + chartPadding) * 2;
    const canvasInitialHeight = (pieRadius + chartPadding) * 2;
    const shuffleArray = (array) => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return shuffledArray;
    }
    const [canvasHeight, setCanvasHeight] = useState(canvasInitialHeight);
    const colourRange = useRef(shuffleArray(d3[colours]));
    const chartRef = useRef(null);
    const legendRef = useRef(null);

    const createPie = d3
        .pie()
        .sort(null)
        .value(d => d.value);
    const createArcPath = d3
        .arc()
        .outerRadius(pieRadius)
        .innerRadius(pieRadius / 2);


    const colour = d3.scaleOrdinal(colourRange.current);
    const format = d3.format(`.${decimals}f`);
    const legend = legendColor()
        .shape('path', d3.symbol().type(d3.symbolCircle)())
        .shapePadding(10)
        .scale(colour);

    useEffect(() => {
        colour.domain(data.map(d => d.legendName));
        const legendGroup = d3.select(legendRef.current);
        legendGroup.call(legend);
        legendGroup.selectAll('text')
            .attr('fill', '#000')
            .style("font-size", 12);

        const legendItems = [...legendGroup.selectAll('g.cell')];
        const legendItemsWidth = legendItems.map(item => item.getBBox().width);
        const [maxWidth, secondMaxWidth] = legendItemsWidth
            .reduce((twoWidest, itemWidth) => {
                if (itemWidth > twoWidest[0]) return [itemWidth, twoWidest[0]];
                else if (itemWidth > twoWidest[1]) return [twoWidest[0], itemWidth]
                else return twoWidest
            }, [0, 0]);
        const legendItemsSpacing = 20;
        const potentialLegendWidth = maxWidth + legendItemsSpacing + secondMaxWidth;

        if (canvasWidth >= legendHorizontalOffset + potentialLegendWidth) {
            legendItems.forEach((item, index, array) => {
                if (index % 2) {
                    const y = legendItems[index - 1]
                        .getAttribute('transform')
                        .split(', ')[1]
                        .slice(0, -1);
                    const x = maxWidth + legendItemsSpacing;
                    item.setAttribute('transform', `translate(${x}, ${y / 2})`);
                    array[index - 1].setAttribute('transform', `translate(0, ${y / 2})`);
                }
            })
        }
        const legendHeight = Math.round(
            [...legendGroup.select('.legendCells')][0].getBBox().height
        );
        const canvasTotalHeight = chartPadding + pieRadius * 2 + legendVerticalOffset + legendHeight;
        setCanvasHeight(canvasTotalHeight);

        const arcTweenEnter = (d) => {
            const i = d3.interpolate(d.endAngle, d.startAngle);

            return t => {
                d.startAngle = i(t);
                return createArcPath(d)
            }
        }
        const textTweenEnter = (d, i, n) => {
            const interpolator = d3.interpolate(0, d.value);

            return t => d3.select(n[i]).text(format(interpolator(t)))
        }
        const arcTweenExit = (d) => {
            const i = d3.interpolate(d.startAngle, d.endAngle);

            return t => {
                d.startAngle = i(t);
                return createArcPath(d);
            };
        };
        const arcTweenUpdate = (d, i, n) => {
            // interpolate between the two objects
            const interpolator = d3.interpolate(n[i]._current, d);
            // update the current prop with new updated data
            n[i]._current = interpolator(1);

            return t => createArcPath(interpolator(t))
        };
        const textTweenUpdate = (d, i, n) => {
            // interpolate between the two objects
            const interpolator = d3.interpolate(n[i]._current, d.value);
            // update the current prop with new updated data
            n[i]._current = interpolator(1);

            return t => d3.select(n[i]).text(format(interpolator(t)))
        };



        const chartGroup = d3.select(chartRef.current);
        const arcGroups = chartGroup.selectAll("g.arc").data(createPie(data));

        const exitingArcGroups = arcGroups.exit();
        exitingArcGroups
            .select('path.arc')
            .transition().duration(750)
            .attrTween("d", arcTweenExit);
        exitingArcGroups
            .select('text')
            .remove();
        exitingArcGroups.each((d, i, n) => setTimeout(() => n[i].remove(), 750));
        arcGroups
            .select('path.arc')
            .transition().duration(750)
            .attrTween("d", (d,i,n)=>arcTweenUpdate(d,i,n));
        arcGroups
            .select('text')
            .transition().duration(750)
            .attr("transform", d => `translate(${createArcPath.centroid(d)})`)
            .tween("text", (d,i,n)=>textTweenUpdate(d,i,n));


        const enteringArcGroups = arcGroups
            .enter()
            .append("g")
            .attr("class", "arc");
        enteringArcGroups
            .append("path")
            .attr("class", "arc")
            .attr("fill", d => colour(d.data.legendName))
            .each((d, i, n) => n[i]._current = d)
            .transition().duration(750)
            .attrTween("d", arcTweenEnter);
        enteringArcGroups
            .append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("fill", "#fff")
            .style("font-size", 16)
            .each((d, i, n) => n[i]._current=d.value)
            .transition().duration(750)
            .attr("transform", d => `translate(${createArcPath.centroid(d)})`)
            .tween("text", (d, i, n) => textTweenEnter(d, i, n));

    }, [data, colour, format, createArcPath, createPie, legend, canvasWidth, chartPadding, pieRadius, legendHorizontalOffset, legendVerticalOffset]);

    return (
        <div>
            <h4>{title}</h4>
            <div className="canvas">
                <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}>
                    <g
                        ref={chartRef}
                        transform={`translate(${pieRadius + chartPadding}, ${pieRadius + chartPadding})`}
                    />
                    <g
                        ref={legendRef}
                        transform={`translate(${legendHorizontalOffset}, ${pieRadius * 2 + chartPadding + legendVerticalOffset})`}
                    />
                </svg>
            </div>
        </div>
    );
}

export default PieChart;
