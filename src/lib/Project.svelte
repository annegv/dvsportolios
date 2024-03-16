<script>
    export let info = {};
    let p = info;
    export let hLevel = 2;
</script>

<article>
    <svelte:element this={"h" + hLevel}>{ p.title }</svelte:element>
    <img src={p.image} alt="">
    <div>
        {p.description}
        <div class="year_label">
            year: {p.year}
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
