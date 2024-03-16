<script>
    import * as d3 from 'd3';
    import projects from '$lib/projects.json';
    import Project from "$lib/Project.svelte";
    import Pie from '$lib/Pie.svelte';

    let rolledData = d3.rollups(projects, v => v.length, d => d.year);
    let pieData = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let query = "";
    let filteredProjects;
    $: filteredProjects = projects.filter(project => {
        if (query) {
            return project.title.includes(query);
        }

        return true;
    });
</script>

<svelte:head>
	<title>projects</title>
</svelte:head>

<h1>{ projects.length } available projects to browse</h1>

<Pie data={pieData} />

<input type="search" bind:value={query}
       aria-label="Search projects" placeholder="search projects…" />

<div class="projects">  
    {#each filteredProjects as p}
        <Project info={p} />
    {/each}
</div>