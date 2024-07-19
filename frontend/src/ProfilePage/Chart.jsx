import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
const Chart = ({ data, onSaveSvg }) => {
    const svgRef = useRef();

    useEffect(() => {
        const width = 600
        const height = 500
        const margin = {top : 40, right: 20, bottom: 10, left: 90}
        // for every change clear existing content and refresh to ensure chart stays in sync with [data]
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        
        const chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
        
        // this creates a discrete line for each selected category
        const lineNames = d3.group(data, d => d.name);
        const times = [...new Set(data.map(d => d.date))].sort((a,b) => a-b);

        // yAxis and xAxis describe the scaling of the axes on the graph
        const xAxis = d3.scaleBand()
            .domain(times)
            .range([0, width])
            .padding(0.2)

        const yAxis = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        // this sets the relationship of x axis to date and y axis to value
        const linePlots = d3.line()
        .x(d => {
            const xValue = xAxis(d.date) + xAxis.bandwidth() / 2;
            return xValue;
        })
        .y(d => yAxis(d.value));

        // this adds the X axis to the svg
        svg.append("g")
            .attr("transform", `translate(${margin.left - 60}, ${height + 10})`)
            .call(d3.axisBottom(xAxis)
                .ticks(times.length)
                .tickFormat(d3.format('d'))
            )
            .call(g => g.append("text")
                .attr("x", width)
                .attr("y", margin.bottom+10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .style("font-size", "12pt")
                .text("Cycle"))

        // this y axis itself and the text are two seperate group elements to get around margin limitations
        svg.append("g")
        .attr("transform", `translate(${margin.left - 60}, ${margin.top - 30})`)
        .call(d3.axisLeft(yAxis)
            .tickValues(d3.range(0, 105, 5))
            .tickFormat(d3.format("d")));

        svg.append("g")
        .attr("transform", `translate(${margin.left + 120}, ${margin.top - 30})`)
        .append("text")
            .attr("y", 20)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text("Percent of Expenditure");

        // populate svg with lines for each unique "name" in data
        const lines = svg.append("g")
        .attr("transform", `translate(${margin.left - 60}, ${10})`)
        .attr("fill", "none")
        .attr("stroke", "forestgreen")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .selectAll("path")
        .data(lineNames)
        .enter()
        .append("path")
            .style("mix-blend-mode", "multiply")
            .attr("d", ([, values]) => linePlots(values))

        // create the dot that will appear on closest data point when you hover over chart, by default this is hidden
        const dot = svg.append("g")
            .attr("display", "none")
        dot.append("circle")
            .attr("r", 2.5)
        dot.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("text-anchor", "middle")
            .attr("y", -8)


        // when pointer enters the graph latch onto closest data point and display dot
        function enteredGraph(){
            lines.style("mix-blend-mode", null).style("stroke", "#ddd")
            dot.attr("display", null)
        }


        // whenever pointer moves recalculate the closest data point
        function movedPointer(event){
            const [xCord, yCord] = d3.pointer(event);
            
            const xAdjusted = xCord - margin.left +60;
            const yAdjusted = yCord - 10
            const closestDateIndex = d3.leastIndex(times, (d) => Math.abs(xAxis(d) + xAxis.bandwidth() / 2 - xAdjusted));
            const closestDate = times[closestDateIndex];
            const pointsOnDate = data.filter(d => d.date === closestDate);
          
            const maxXDistance = xAxis.range()[1] - xAxis.range()[0];
            const maxYDistance = yAxis.range()[0] - yAxis.range()[1];
            const closestPoint = d3.least(pointsOnDate, d => {
                // normalize distances in relation to SVG size, this essentially converts from image coordinate system to cartesian
                const normalizedXDist = Math.abs((xAxis(d.date) + xAxis.bandwidth() / 2 - xAdjusted) / maxXDistance);
                const normalizedYDist = Math.abs((yAxis(d.value) - yAdjusted) / maxYDistance);
                // now that we have cartesian style coordinates, find the Euclidean distance 
                return Math.sqrt(normalizedXDist * normalizedXDist + normalizedYDist * normalizedYDist);
            });

        


            dot.attr("transform", `translate(${xAxis(closestPoint.date) + margin.left + 15}, ${yAxis(closestPoint.value) + 10})`)
            dot.select("text").text(`${closestPoint.name}: ${closestPoint.value}`);
            
            lines.style("stroke", e => e[0] === closestPoint.name ? null : "#ddd")
                .filter(e => e[0] === closestPoint.name).raise();
            
            svg.property("value", closestPoint).dispatch("input", {bubbles: true});
        }


        // when the pointer leaves the svg recolor all lines and remove the dot
        function pointerOutside() {
            lines.style("mix-blend-mode", "multiply").style("stroke", null);
            dot.attr("display", "none");
            svg.node().value = null;
            svg.dispatch("input", {bubbles: true});
        }


        svg.on("pointerenter", enteredGraph)
            .on("pointerleave", pointerOutside)
            .on("pointermove", (event) => {
                movedPointer(event);
            })
            .on("touchstart", event => event.preventDefault());
        
        // once the svg is rendered, cache it in localStorage
        if (onSaveSvg && svgRef.current) {
            onSaveSvg(svgRef.current);
        }   
            
        }, [data, onSaveSvg]);


        return (
        <svg ref={svgRef} />
        );
    };
    export default Chart;