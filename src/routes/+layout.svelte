<script>
    import { page } from '$app/stores';

    let pages = [
        {url: "./", title: "home"},
        {url: "./projects", title: "projects"},
        {url: "./cv", title: "resume"},
        {url: "./contact", title: "contact"},
        {url: "https://github.com/annegv", title: "github"}
    ];
</script>

<nav>
	{#each pages as p }
        <a href={ p.url } class:current={ "." + $page.route.id === p.url } target={ p.url.startsWith("http") ? "_blank" : null }>{ p.title }</a>
	{/each}
</nav>

<slot />

<style>
nav {
    --border-color: oklch(50% 10% 200 / 40%);
    display: flex;
    margin-bottom: 0.5em;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: var(--border-color);
}

a {
    flex: 1;
    text-decoration: none;
    color: inherit;
    text-align: center;
    padding: 0.5em;
}

a:hover {
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: var(--color-accent);
    padding-bottom: calc(0.5em - 1px);
}
</style>