<script>
    import * as d3 from 'd3';
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

    export let data = [];
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    let sliceGenerator = d3.pie().value(d => d.value);
    let arcData = sliceGenerator(data);
    let arcs = arcData.map(d => arcGenerator(d));

</script>

<div class="container">
    <svg viewBox="-50 -50 100 100">
        {#each arcs as arc, i}
            <path d={ arc } fill={ colors(i) } />
        {/each}
    </svg>

    <ul class="legend">
        {#each data as d, index}
            <li style="--color: { colors(index) }" class="legend_item">
                <span class="swatch"></span>
                {d.label} <em>({d.value})</em>
            </li>
        {/each}
    </ul>
</div>


<style>
    svg {
        max-width: 20em;
        margin-block: 2em;
        display: block;

        /* Do not clip shapes outside the viewBox */
        overflow: visible;
    }

    .container {
        display: flex;
        gap: 2em;
        align-items: center;
    }

    .swatch {
        display: inline-block;
        width: 1em;
        height: 1em;
        background-color: var(--color);
        border-radius: 50%;
    }

    .legend {
        display: grid;
        flex: 1;
        grid-template-columns: repeat(auto-fill, minmax(9em, 1fr));
        border: solid #c4c4c4 2px;
        padding: 1em;
        margin: 1em;
    }

    .legend_item {
        display: flex;
        align-items: center;
        gap: 1em;
    }

    em {
        color: #c4c4c4;
    }
</style>