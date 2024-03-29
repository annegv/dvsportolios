<script>
	import * as d3 from "d3";
	import { onMount } from "svelte";
	import Pie from "$lib/Pie.svelte";

	let data = [];
	let commits = [];
	let max_depth = 0;
	let num_files = 0;
	let fileLengths = [];
	let maxFileLength = 0;

	onMount(async () => {
		data = await d3.csv("loc.csv", row => ({
			...row,
			line: Number(row.line), // or just +row.line
			depth: Number(row.depth),
			length: Number(row.length),
			date: new Date(row.date + "T00:00" + row.timezone),
			datetime: new Date(row.datetime)
		}));

		max_depth = d3.max(data, d => d.depth);
		num_files = d3.group(data, d => d.file).size;
		fileLengths = d3.rollups(data, v => d3.max(v, v => v.line), d => d.file);
		maxFileLength = d3.greatest(fileLengths, (d) => d[1])?.[1];

		commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
		let first = lines[0];
		let {author, date, time, timezone, datetime} = first;
		let ret = {
			id: commit,
			url: "https://github.com/annegv/dvsportolios/commit/" + commit,
			author, date, time, timezone, datetime,
			hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
			totalLines: lines.length
		};

		// Like ret.lines = lines
		// but non-enumerable so it doesn’t show up in JSON.stringify
		Object.defineProperty(ret, "lines", {
			value: lines,
			configurable: true,
			writable: true,
			enumerable: false,
		});

		return ret;
	});
});


	let width = 1000, height = 600;
	let margin = {top: 10, right: 10, bottom: 30, left: 20};
	let usableArea = {
		top: margin.top,
		right: width - margin.right,
		bottom: height - margin.bottom,
		left: margin.left
	};
	usableArea.width = usableArea.right - usableArea.left;
	usableArea.height = usableArea.bottom - usableArea.top;

	$: yScale = d3.scaleLinear()
			.domain([0, 24])
			.range([usableArea.bottom, usableArea.top]);
	$: xScale = d3.scaleTime()
			.domain(d3.extent(commits, c => c.datetime))
			.range([usableArea.left, usableArea.right])
			.nice();

	let xAxis, yAxis, yAxisGridlines;
	$: {
		d3.select(xAxis).call(d3.axisBottom(xScale));
		d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
		d3.select(yAxisGridlines).call(d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width));
	}

	let hoveredIndex = -1;
	let hoveredCommit = {};
	$: {
		if (hoveredIndex != -1) {
			hoveredCommit = commits[hoveredIndex];
		}
	}

	let cursor = {x: 0, y: 0};
	let svg;
	let brushSelection;

	function brushed (evt) {
		brushSelection = evt.selection;
	}

	function isCommitSelected (commit) {
		if (!brushSelection) {
			return false;
		}
		
		let min = {x: brushSelection[0][0], y: brushSelection[0][1]};
		let max = {x: brushSelection[1][0], y: brushSelection[1][1]};
		let x = xScale(commit.datetime);
		let y = yScale(commit.hourFrac);
		return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
	}

	$: {
		d3.select(svg).call(d3.brush().on("start brush end", brushed));
		d3.select(svg).selectAll(".dots, .overlay ~ *").raise();
	}

	$: selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
	$: hasSelection = brushSelection && selectedCommits.length > 0;

	$: selectedLines = (hasSelection ? selectedCommits : commits).flatMap(d => d.lines);
	$: languageBreakdown = d3.rollups(selectedLines, v => d3.count(v, d => d.line), d => d.type);
</script>

<svelte:head>
	<title>meta</title>
</svelte:head>

<h1>meta</h1>

<dl class="stats">
	<dt>total <abbr title="lines of code">LOC</abbr></dt>
	<dd>{data.length}</dd>

	<dt>total commits</dt>
	<dd>{commits.length}</dd>

	<dt>max depth</dt>
	<dd>{max_depth}</dd>

	<dt>files</dt>
	<dd>{num_files}</dd>

	<dt>max file length</dt>
	<dd>{maxFileLength}</dd>
</dl>

<svg viewBox="0 0 {width} {height}" bind:this={svg}>
	<g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
	<g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
	<g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
	<g class="dots">
		{#each commits as commit, index }
			<circle
				cx={ xScale(commit.datetime) }
				cy={ yScale(commit.hourFrac) }
				r="5"
				fill="steelblue"

				on:mouseenter={evt => {
					hoveredIndex = index;
					cursor = {x: evt.x, y: evt.y};
				}}
				on:mouseleave={evt => hoveredIndex = -1}
				class:selected={isCommitSelected(commit)}
			/>
		{/each}
	</g>
</svg>

<p>{hasSelection ? selectedCommits.length : "no"} commits selected</p>

<dl class="stats">
	{#each languageBreakdown as [language, lines]}
		<dt>{language}</dt>
		<dd>{lines} lines ({d3.format(".1~%")(lines / selectedLines.length)})</dd>
	{/each}	
</dl>

<Pie data={Array.from(languageBreakdown).map(([language, lines]) => ({label: language, value: lines}))} />

<dl id="commit-tooltip" class="info tooltip" hidden={hoveredIndex === -1} style="top: {cursor.y}px; left: {cursor.x}px">
	<dt>commit</dt>
	<dd><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd>

	<dt>date</dt>
	<dd>{ hoveredCommit.datetime?.toLocaleDateString("en", 
		{weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",}) }</dd>

	<dt>time</dt>
	<dd>{ hoveredCommit.datetime?.toLocaleTimeString() }</dd>

	<dt>author</dt>
	<dd>{ hoveredCommit.author }</dd>

	<dt>lines</dt>
	<dd>{ hoveredCommit.totalLines }</dd>
</dl>


<style>
	.stats {
		display: flex;
		flex-flow: column wrap;
		max-height: 6em;
	}

	.stats dt {
		padding: 2px 3px;
		font-size: 90%;
		font-style: italic;
		color: #9a9a9a;
	}

	.stats dd {
		margin: 0;
		padding: 3px;
		min-height: 2em;
		font-size: 125%;
	}

	svg {
		overflow: visible;
	}

	.gridlines {
		stroke-opacity: .2;
	}

	dl.info {
		display: grid;
		grid-gap: 4px 16px;
  		grid-template-columns: max-content;
		margin: 0;

		transition-duration: 500ms;
		transition-property: opacity, visibility;

		&[hidden]:not(:hover, :focus-within) {
			opacity: 0;
			visibility: hidden;
		}
	}

	.info dt {
		font-weight: bold;
	}

	.info dd {
		margin: 0;
  		grid-column-start: 2;
	}

	.tooltip {
		position: fixed;
		top: 1em;
		left: 1em;
		background-color: white;
		box-shadow: 0px 0px 13px 5px  rgb(234, 234, 234);
		padding: 1em;
		border-radius: 15px;
	}

	circle {
		transition: 200ms;
		transform-origin: center;
		transform-box: fill-box;
		&:hover {
			transform: scale(1.5);
		}
	}

	@keyframes marching-ants {
		to {
			stroke-dashoffset: -8; /* 5 + 3 */
		}
	}

	svg:global(.selection) {
		fill-opacity: 10%;
		stroke: black;
		stroke-opacity: 70%;
		stroke-dasharray: 5 3;
		animation: marching-ants 2s linear infinite;
	}

	.selected {
		fill: #d88d83;
	}
</style>
