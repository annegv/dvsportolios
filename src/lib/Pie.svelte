<script>
    import * as d3 from 'd3';
    export let data = [];
    export let selectedIndex = -1;

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    let sliceGenerator = d3.pie().value(d => d.value);

    let arcData;
    $: arcData = sliceGenerator(data);
    let arcs;
    $: arcs = arcData.map(d => arcGenerator(d));
    
    function toggleWedge (index, event) {
        if (!event.key || event.key === "Enter") {
            selectedIndex = selectedIndex === index ? -1 : index;
        }
    }
</script>


<div class="container">
    <svg viewBox="-50 -50 100 100">
        {#each arcs as arc, index}
            <path d={arc} fill={ colors(index) }
                class:selected={selectedIndex === index}
                on:click={e => toggleWedge(index, e)} 
                on:keyup={e => toggleWedge(index, e)}
                tabindex="0" role="button" aria-label="select projects"/>
        {/each}
    </svg>

    <ul class="legend">
        {#each data as d, index}
            <li style="--color: { colors(index) }" class="legend_item">
                <span class="swatch" class:selected={selectedIndex === index}></span>
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

    svg:has(path:hover, path:focus-visible) {
        path:not(:hover, :focus-visible) {
            opacity: 50%;
        }
    }

    path {
        transition: 300ms;
        cursor: pointer;
        outline: none;
    }

    .selected {
        --color: #2e2c4d !important;

        &:is(path) {
            fill: var(--color);
        }
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