import { useEffect, useRef } from 'react';
import chartConfig from '../../../HelperFuncs/chartConfig.json'
import * as d3 from 'd3';

function CompBoxPlot({userData, similarUserData, OnClickedUserId, onSaveSvg, showBoxPlots, showUserData, OnBoxClick}) {
    const svgRef = useRef();

    useEffect(() => {
        const width = chartConfig.width
        const height = chartConfig.height
        const margin = chartConfig.margins
        // for every change clear existing content and refresh to ensure chart stays in sync with [data]
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right + chartConfig.width/3)
            .attr("height", height + margin.top + margin.bottom + margin.top)

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
            
            // elements are ordered in ascending order of value to make quartile / median computation easier
            entries.sort((a,b) => a.value - b.value)
            const values = entries.map(v => v.value);
            /* get the relevant descriptive statistical details for our data. 
            This includes the quartile data: .25, .5 (median),and .75 percentiles. 
            interquartile range (IQR) which measures the range of the middle 50% of data (this defines the length of the box) and 
            upper and lower outlier range bounds (these define whisker length)
            */ 
            const maxima = values[values.length -1]
            const minima = values[0]
            const topQuartileIndex = Math.floor(0.75 * values.length)
            const topQuartile = values[topQuartileIndex]
            const medianQuartileIndex =  Math.floor(0.5 * values.length)
            const medianQuartile = values[medianQuartileIndex]
            const bottomQuartileIndex = Math.floor(0.25 * values.length)
            const bottomQuartile = values[bottomQuartileIndex]
            const intraQuartileRange = topQuartile - bottomQuartile
            const bottomOutlierRange = Math.max(minima, bottomQuartile - intraQuartileRange * 1.5)
            const topOutlierRange = Math.min(maxima, topQuartile + intraQuartileRange * 1.5)

           return {
            category, 
            entries, 
            quartiles: [bottomQuartile, medianQuartile, topQuartile],
            range: [bottomOutlierRange, topOutlierRange],
            userData: [userData]
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
            .range([margin.left, width - margin.right])
            .paddingInner(1)
            .paddingOuter(0.5);
        
        /* 
        xAxis bandwidth isn't being properly calculated (I assume because of the list of strings for domain)
        so this is a manual computation in place of [xAxis.bandwidth()]
        */
        const bandwidth = (width - margin.left - margin.right) / categories.length;
        
        const yAxis = d3.scaleLinear()
            .domain([0, 100])
            .range([chartConfig.height, 0]);
        
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${height + margin.bottom + margin.top})`)
            .call(d3.axisBottom(xAxis));

        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top - (margin.top - margin.bottom)})`)
            .call(d3.axisLeft(yAxis))

        svg.append("g")
            .attr("transform", `translate(${margin.left * 3}, ${margin.top})`)
            .append("text")
                .attr("y", margin.bottom)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text("Percent of Expenditure");
        
        // each category is divided into it's own svg g element for modular control
        const categoryGroups = svg.selectAll("g.category")
          .data(categoryValues)
          .join("g")
            .attr("class", "category")
            .attr("transform", d => `translate(${xAxis(d.category)}, 0)`)

        // conditionally append box plots based on user input through the corresponding checkbox
        if(showBoxPlots){
            // the placement of this if statement in the program allows dots to be placed on top of the box so their mouse effects can still be reached
            const boxWidth = chartConfig['scatter-range'] - chartConfig['scatter-range'] / 2 + margin.left;
            const boxOffset = (bandwidth - boxWidth) / 2;

            const boxPlots = categoryGroups.selectAll("rect.box-plot")
                .data(d => [d])
                .join("g")
                    .attr("transform", `translate(${boxOffset}, 0)`)
            
            boxPlots.append("rect")
                .attr("class", "box-plot")
                .attr("y", d => yAxis(d.quartiles[2]))
                .attr("height", d => yAxis(d.quartiles[0]) - yAxis(d.quartiles[2]))
                .attr("width", boxWidth)
                .attr("fill", "#ddd")
                .attr("opacity", 0.6)
                .on("click", (event, d) => {
                    // if user data is being shown all other inputs are blocked
                    if(!showUserData){
                        OnBoxClick(d)
                    }
                })

            boxPlots.append("line")
                .attr("class", "whisker")
                .attr("y1", d => yAxis(d.range[1]))
                .attr("y2", d => yAxis(d.range[0]))
                .attr("x1", (bandwidth - (bandwidth * chartConfig['box-width-factor']))/2 + chartConfig['scatter-range']/2)
                .attr("x2", (bandwidth - (bandwidth * chartConfig['box-width-factor']))/2 + chartConfig['scatter-range']/2)
                .attr("stroke", "black")
            
            boxPlots.append("line")
                .attr("class", "median")
                .attr("y1", d => yAxis(d.quartiles[1]))
                .attr("y2", d => yAxis(d.quartiles[1]))
                .attr("x1", 0)
                .attr("x2", boxWidth)
                .attr("stroke", "black")

            boxPlots.append("line")
                .attr("class", "cap")
                .attr("y1", d => yAxis(d.range[1]))
                .attr("y2", d => yAxis(d.range[1]))
                .attr("x1", boxWidth * .2)
                .attr("x2", boxWidth * .8)
                .attr("stroke", "black")

            boxPlots.append("line")
                .attr("class", "cap")
                .attr("y1", d => yAxis(d.range[0]))
                .attr("y2", d => yAxis(d.range[0]))
                .attr("x1", boxWidth * .2)
                .attr("x2", boxWidth * .8)
                .attr("stroke", "black")  
        }

        const similarDots = categoryGroups.selectAll("circle.point")
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

        /* 
        if [showUserData] is enabled, plot the data for user whose profile we're on, 
        highlight these points by graying out other dots and disabling their pointer effects
        */
        if(showUserData){

            categoryGroups.selectAll("circle.user-point")
            /* 
            because userData field in [categoryValues] is passed as the direct userData object, 
            categories are not seperated in the same way as in entries 
            so we need to map out each category to get the category name and associated percent
            */
            .data(d => {
                return d.userData.map(user => ({
                    total_percent: user[d.category].total_percent,
                    category: d.category
                }));
            })
            .join("circle")
                .attr("class", "user-point")
                .attr("cx", () => Math.random() * chartConfig['scatter-range'] - chartConfig['scatter-range'] / 2 + margin.left)
                .attr("cy", d => yAxis(d.total_percent))
                .attr("fill", "steelblue")
                .attr("r", chartConfig.dot_radius * 2) 
                .attr("data-category", d => d.category)
            
            similarDots
                .attr("fill", "#ddd")
                .style("pointer-events", "none")

        }

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

        // users can reset the click state by clicking on the graph itself (not a circle or box)
        svg.on("click", (event) => {
            const target = event.target
            if(target.className.baseVal !== 'point'){
                OnClickedUserId(0)
            }
            if(target.className.baseVal !== 'box-plot'){
                OnBoxClick({})
            }

        })
          

        if (onSaveSvg && svgRef.current) {
            onSaveSvg(svgRef.current);
        } 

    }, [similarUserData, userData, showBoxPlots, showUserData])
    return (
        <svg ref={svgRef} />
        );
}

export default CompBoxPlot;