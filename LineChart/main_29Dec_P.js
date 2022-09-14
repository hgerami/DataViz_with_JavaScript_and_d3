// JavaScript source code
const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
const WIDTH = 1000 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM



const svg = d3.select("#chart-area").append("svg")
	.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
	.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
	.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// time parsers/formatters
const parseTime = d3.timeParse("%Y-%m-%d")
const formatTime = d3.timeFormat("%d %b %Y")
// for tooltip
const bisectDate = d3.bisector(d => d.date).left

// add the line for the first time
g.append("path")
	.attr("class", "line")
	.attr("fill", "none")
	.attr("stroke", "blue")
	.attr("stroke-width", "3px")

// axis labels
const xLabel = g.append("text")
	.attr("class", "x axisLabel")
	.attr("y", HEIGHT + 100)
	.attr("x", WIDTH / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Time")
const yLabel = g.append("text")
	.attr("class", "y axisLabel")
	.attr("transform", "rotate(-90)")
	.attr("y", -60)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Yield (%)")

// scales
const x = d3.scaleTime().range([0, WIDTH])
const y = d3.scaleLinear().range([HEIGHT, 0])

// axis generators
const xAxisCall = d3.axisBottom()
	.ticks(12)
	.tickFormat(formatTime)

yValue = $("#var-select").val()

var format = d3.format(".1f")

//yAxisCall = d3.axisLeft()
//	.ticks(6)
//	.tickSize(-WIDTH)
	/*.tickFormat(d => d + "%")*/
	//.tickFormat(d => yValue == "yield" ? format(d) + "%" : "$" + d3.format(",")(d))
	//.tickFormat(d => `${parseInt(d / 1000)}k`)

// axis groups
const xAxis = g.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0, ${HEIGHT})`)
const yAxis = g.append("g")
	.attr("class", "y axis")

// event listeners
$("#coin-select").on("change", update)
$("#var-select").on("change", update)

// add jQuery UI slider



 min_max_date=
	d3.csv("CSV_HG_for_charts.txt").then(data => {
		// prepare and clean data
		filteredData = data.filter(d => {
					return !(d[" Yield"] == ' ')
				}).map(d => {
					// console.log(d)
					//d["yield"] = Number(d[" Yield"])
					//d["market_cap"] = Number(d[" Market Cap"])
					d["date"] = parseTime(d["Date"])
					//d["#_of_Spacs"] = Number(d[" # of Spacs"])
					//d["discount"] = Number(d[" Discount"])
					//d["price_index"] = Number(d[" Price "])
					return d
				})
				min_date = filteredData[0]["date"].getTime()
				max_date = filteredData[filteredData["length"]-1]["date"].getTime()
				return [min_date, max_date]
			})
console.log(min_max_date)
			
//}

$("#date-slider").slider({
	range: true,
	// max: parseTime("2021-10-18").getTime(),
	max: min_max_date[1],
	// min: parseTime("2020-04-08").getTime(),
	min: min_max_date[0], 
	step: 8640000, // one day
	values: [
		//parseTime("2020-04-08").getTime(),
		//parseTime("2021-10-18").getTime()
		min_max_date[0],
		min_max_date[1]
	],
	slide: (event, ui) => {   
		$("#dateLabel1").text(formatTime(new Date(ui.values[0])))
		$("#dateLabel2").text(formatTime(new Date(ui.values[1])))
		update()
	}
})


d3.csv("CSV_HG_for_charts.txt").then(data => {
	// prepare and clean data
	filteredData = data.filter(d => {
				return !(d[" Yield"] == ' ')
			}).map(d => {
				// console.log(d)
				d["yield"] = Number(d[" Yield"])
				d["market_cap"] = Number(d[" Market Cap"])
				d["date"] = parseTime(d["Date"])
				d["#_of_Spacs"] = Number(d[" # of Spacs"])
				d["discount"] = Number(d[" Discount"])
				d["price_index"] = Number(d[" Price "])
				return d
			})
	console.log(filteredData)
	// run the visualization for the first time


	
	update()
})


function update() {
	const t = d3.transition().duration(1000)

	// filter data based on selections
	const coin = $("#coin-select").val()
	yValue = $("#var-select").val()
	console.log(yValue)
	const sliderValues = $("#date-slider").slider("values")
	const dataTimeFiltered = filteredData.filter(d => {
		console.log(sliderValues[0] )
		return ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1]))
	})
	//const dataTimeFiltered = filteredData
	// update scales
	x.domain(d3.extent(dataTimeFiltered, d => d.date))

	yValue == "yield" || yValue == "discount" ?

		y.domain([d3.min(dataTimeFiltered, d => d[yValue]) -1, d3.max(dataTimeFiltered, d => d[yValue]) * 1.1]):
		y.domain([d3.min(dataTimeFiltered, d => d[yValue]) / 1.15, d3.max(dataTimeFiltered, d => d[yValue]) * 1.1])
		

	//y.domain([
	//	d3.min(dataTimeFiltered, d => d[yValue]) / 1.0,
	//	d3.max(dataTimeFiltered, d => d[yValue]) * 1.0
	//])

	// fix for format values
	//const formatSi = d3.format(".1s")
	//function formatAbbreviation(x) {
	//	const s = formatSi(x)
	//	switch (s[s.length - 1]) {
	//		case "G": return s.slice(0, -1) + "B" // billions
	//		case "k": return s.slice(0, -1) + "K" // thousands
	//	}
	//	return s
	//}

	// update axes
	xAxisCall.scale(x)
	xAxis.transition(t).call(xAxisCall)
		.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", ".15em")
		.attr("transform", "rotate(-65)")

	
	//yAxis.transition(t).call(yAxisCall.tickFormat(formatAbbreviation))

	const text = yValue == "yield" ? "Yield (%)" : yValue == "market_cap" ? "Market Cap ($mm)" : yValue == "#_of_Spacs" ? " Total Number of SPACs" : yValue == "discount" ? "Average SPAC Premium / (Discount) (%)": "SPAC Index (%)"
	yLabel.text(text)

	yAxisCall = d3.axisLeft(y)
		.ticks(6)
		.tickSize(-WIDTH)
		/*.tickFormat(d => d + "%")*/
		.tickFormat(d => yValue == "yield" || yValue == "discount" || yValue == "price_index"  ? format(d) + "%" : yValue =="#_of_Spacs" ? d3.format(".0f")(d) : "$" + d3.format(",")(d))

	yAxisCall.scale(y)

	yAxis.transition(t).call(yAxisCall)
	// clear old tooltips
	d3.select(".focus").remove()
	d3.select(".overlay").remove()

	/******************************** Tooltip Code ********************************/

	const focus = g.append("g")
		.attr("class", "focus")
		.style("display", "none")

	focus.append("line")
		.attr("class", "x-hover-line hover-line")
		.attr("y1", 0)
		.attr("y2", HEIGHT)

	focus.append("line")
		.attr("class", "y-hover-line hover-line")
		.attr("x1", 0)
		.attr("x2", WIDTH)

	focus.append("circle")
		.attr("r", 7.5)

	focus.append("text")
		.attr("x", 15)
		.attr("dy", ".31em")

	g.append("rect")
		.attr("class", "overlay")
		.attr("width", WIDTH)
		.attr("height", HEIGHT)
		.on("mouseover", () => focus.style("display", null))
		.on("mouseout", () => focus.style("display", "none"))
		.on("mousemove", mousemove)

	function mousemove() {
		const x0 = x.invert(d3.mouse(this)[0])
		const i = bisectDate(dataTimeFiltered, x0, 1)
		//console.log(i)
		const d0 = dataTimeFiltered[i - 1]
		const d1 = dataTimeFiltered[i]
		const d = x0 - d0.date > d1.date - x0 ? d1 : d0
		focus.attr("transform", `translate(${x(d.date)}, ${y(d[yValue])})`)
		focus.select("text").text(yValue == "yield" || yValue == "discount" || yValue == "price_index" ? d3.format(".1f")(d[yValue]) : yValue == "#_of_Spacs" ? d3.format(".0f")(d[yValue]) : d3.format(",")(d[yValue])    )
		focus.select(".x-hover-line").attr("y2", HEIGHT - y(d[yValue]))
		focus.select(".y-hover-line").attr("x2", -x(d.date))
	}

	/******************************** Tooltip Code ********************************/

	// Path generator
	line = d3.line()
		.x(d => x(d.date))
		.y(d => y(d[yValue]))

	// Update our line path
	g.select(".line")
		.transition(t)
		.attr("d", line(dataTimeFiltered))

	// Update y-axis label
	//const newText = (yValue === "yield") ? "Price ($)"
	//	:  "Market Capitalization ($)"
	
	//yLabel.text(newText)
}