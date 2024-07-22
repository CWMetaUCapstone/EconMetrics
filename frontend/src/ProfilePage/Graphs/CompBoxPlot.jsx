import { useEffect, useRef } from 'react';
import chartConfig from '../../../HelperFuncs/chartConfig.json'
import * as d3 from 'd3';

function CompBoxPlot({userData, similarUserData, OnClickedUserId, onSaveSvg}) {
    const svgRef = useRef();

    useEffect(() => {
        const width = chartConfig.width
        const height = chartConfig.height
        const margin = chartConfig.margins
        // for every change clear existing content and refresh to ensure chart stays in sync with [data]
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right + 200)
            .attr("height", height + margin.top + margin.bottom)

        /* 
        [categories] defines the list of ticks / groups on the xAxis, this logic ensures that all ticks 
        1. appear once in at least one similar user
        2. appear in this users transactions object [userData]
        note: only 'sum' categories e.g. food, transportation, etc. are considered for this plot for brevity
        */
        const categories = []
        similarUserData.forEach(user => {
                Object.keys(user.transaction).forEach(category => {
                    if (category in userData && !categories.includes(category)) {
                        categories.push(category);
                      }
                }
                )
        });

        /* 
        [categoryValues] is a nested array where each outer array element represents a parent category (e.g. 'food') and 
        inside this array are objects holding a similar users percent for this category, the similar user's id, and the parent category
        */
        const categoryValues = categories.filter(category => {
            const entries = similarUserData.filter(user => user.transaction[category]);
            return entries.length > 0;
          }).map(category => {
            const entries = similarUserData.filter(user => user.transaction[category])
            .map(user => ({
                id: user.id,
                value: user.transaction[category].total_percent,
                category: category
            }));
            
            // elements are ordered in ascending order of value to make quantile / median computation easier
            entries.sort((a,b) => a.value - b.value)
            const values = entries.map(v => v.value);

            /* get the relevant descriptive statistical details for our data. 
            This includes the quantile data: .25, .5 (median),and .75 percentiles. 
            interquantile range (IQR) which measures the range of the middle 50% of data (this defines the length of the box) and 
            upper and lower outlier range bounds (these define whisker length)
            */ 
           const bottomQuantile = d3.quantile(values, 0.25)
           const medianQuantile = d3.quantile(values, 0.5)
           const topQuantile = d3.quantile(values, 0.75)
           const intraQuantileRange = topQuantile - bottomQuantile
           const bottomOutlierRange = Math.max(d3.min(values), bottomQuantile - intraQuantileRange * 1.5)
           const topQuantileRange = Math.min(d3.max(values), topQuantile + intraQuantileRange * 1.5)

           return {
            category, 
            entries, 
            quantiles: [bottomQuantile, medianQuantile, topQuantile],
            range: [bottomOutlierRange, topQuantileRange]
           }
          });
        
        // a set of all user Ids is used to assign dots for each user a unique color for better UX
        const idList = [... new Set(categoryValues.flatMap(d => d.entries.map(v => v.id)))]

        // this d3 element defines the scale rules for colors and assigns each id a color in the talbleau10 scheme
        const colorRules = d3.scaleOrdinal()
          .domain(idList)
          .range(d3.schemeTableau10)

        const xAxis = d3.scaleBand()
            .domain(categories)
            .range([margin.left, chartConfig.width + margin.right + margin.left + margin.bottom])
            .paddingInner(2)
            .paddingOuter(0.5);

        const yAxis = d3.scaleLinear()
            .domain([0, 100])
            .range([chartConfig.height, 0]);
        
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${height + margin.bottom})`)
            .call(d3.axisBottom(xAxis));

        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top - (margin.top - margin.bottom)})`)
            .call(d3.axisLeft(yAxis))
        
        // each category is divided into it's own svg g element for modular control
        const categoryGroups = svg.selectAll("g.category")
          .data(categoryValues)
          .join("g")
            .attr("class", "category")
            .attr("transform", d => `translate(${xAxis(d.category)}, 0)`)

        categoryGroups.selectAll("circle.point")
          .data(d => d.entries)
          .join("circle")
            .attr("class", "point")
            // the x-axis value for dots are randomized within the range of the parent category to give more of a scattered look to improve clarity 
            .attr("cx", () => Math.random() * chartConfig['scatter-range'] - chartConfig['scatter-range'] / 2 + margin.left)
            .attr("cy", d => yAxis(d.value))
            .attr("fill", d => colorRules(d.id))
            .attr("r", chartConfig.dot_radius * 1.5) 
            .attr("data-category", d => d.category)
            .attr("data-user-id", d => d.id)

        // if the user hovers over a dot, all dots corresponding to the user associated with that dot are highlighted
        svg.on("mouseover", (event) => {
            const target = event.target
            if(target.className.baseVal === 'point'){
                const userId = target.getAttribute("data-user-id");
                svg.selectAll("circle.point")
                    .attr("opacity", function(){
                        return this.getAttribute("data-user-id") === userId ? 1 : 0.2
                    })
            }
        }).on("mouseout", () => {
            svg.selectAll("circle.point")
                .attr("opacity", 1)
        });

        // if a circle is clicked, the corresponding userId is propagated onto profile page to show details about that user
        svg.selectAll("circle.point")
            .on("click", (event, d) => {
                const userId = d.id
                OnClickedUserId(userId)
            })

        // user's can reset the click state by clicking on the graph itself (not a circle)
        svg.on("click", (event) => {
            const target = event.target
            if(target.className.baseVal !== 'point'){
                OnClickedUserId(0)
            }
        })

        if (onSaveSvg && svgRef.current) {
            onSaveSvg(svgRef.current);
        } 

    }, [similarUserData, userData])
    return (
        <svg ref={svgRef} />
        );
}

export default CompBoxPlot;