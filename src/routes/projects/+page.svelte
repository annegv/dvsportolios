<script>
    import projects from '$lib/projects.json';
    import Project from "$lib/Project.svelte";
</script>

<svelte:head>
	<title>projects</title>
</svelte:head>

<h1>{ projects.length } available projects to browse</h1>
<div class="projects">  
    {#each projects as p}
        <Project info={p} />
    {/each}
</div>