<script>
    import * as d3 from 'd3';
    import projects from '$lib/projects.json';
    import Project from "$lib/Project.svelte";
    import Pie from '$lib/Pie.svelte';

    let query = "";
    let filteredProjects;
    $: filteredProjects = projects.filter(project => {
        let values = Object.values(project).join("\n").toLowerCase();
        return values.includes(query.toLowerCase());
    });

    // Make sure the variable definition is *outside* the block
    let pieData;

    $: {
        // Initialize to an empty object every time this runs
        pieData = {};
        let rolledData = d3.rollups(filteredProjects, v => v.length, d => d.year);

        pieData = rolledData.map(([year, count]) => {
            return { value: count, label: year };
        });
    }

    let selectedYearIndex = -1;
    let selectedYear;
    $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;

    $: filteredByYear = filteredProjects.filter(project => {
        if (selectedYear) {
            return project.year === selectedYear;
        }
        return true;
    });
</script>

<svelte:head>
	<title>projects</title>
</svelte:head>

<h1>{ projects.length } available projects to browse</h1>

<Pie data={pieData} bind:selectedIndex={selectedYearIndex} />

<input type="search" bind:value={query}
       aria-label="search projects" placeholder="search projects…" />

<div class="projects">  
    {#each filteredByYear as p}
        <Project info={p} />
    {/each}
</div>

<style>
    input {
        width: 100%;
        padding: 1em;
        font: 110% system-ui;
    }
</style>