<script>
    export let info = {};
    export let hLevel = 2;
</script>

<article>
    <svelte:element this={"h" + hLevel}>{ info.title }</svelte:element>
    <img src={info.image} alt="">
    <div>
        {info.description}
        <div class="year_label">
            year: {info.year}
            {#if info.url != ""}
                | <a href={info.url} target="_blank">project url</a>
            {/if}
        </div> 
    </div>
</article>

<style>
    article {
        display: grid;
        grid-template-rows: subgrid;
        grid-row: span 3;
        margin: 0px;
    }

    .year_label {
        font-weight: bold;
        margin-top: 10px;
    }
</style>
