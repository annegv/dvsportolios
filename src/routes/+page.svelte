<script>
    import projects from '$lib/projects.json';
    import Project from "$lib/Project.svelte";
</script>

<svelte:head>
	<title>home</title>
</svelte:head>

<h1>anne gvozdjak</h1>
<p>junior at MIT; double major in cs and business analytics; kind of tall; milk chocolate lover; wears glasses; cheese pizza enjoyer; physics hater; originally from washington</p>
<img src="images/frog.jpg"
    alt="green frog seated on dark gray surface with an air of hope"
    width="500"/>
<h2>most recent projects</h2>
<div class="projects">  
    {#each projects.slice(0, 3) as p}
        <Project info={p} hLevel=3/>
    {/each}
</div>