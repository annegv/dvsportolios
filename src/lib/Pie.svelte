<script>
    import * as d3 from 'd3';
    export let data = [];
    export let selectedIndex = -1;
    export let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let pieData;
    let arcData;
    let arcs;

    $: {
        oldData = pieData;
        pieData = d3.sort(data, d => d.label);
        arcData = sliceGenerator(pieData);
        arcs = arcData.map(d => arcGenerator(d));
        pieData = pieData.map((d, i) => ({...d, ...arcData[i], arc: arcs[i]}));
        transitionArcs();
    };

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let sliceGenerator = d3.pie().value(d => d.value).sort(null);

    function toggleWedge (index, event) {
        if (!event.key || event.key === "Enter") {
            selectedIndex = selectedIndex === index ? -1 : index;
        }
    }

    let oldData = [];
    let wedges = {};
    let transitionDuration = 100;

    function transitionArcs() {
        let wedgeElements = Object.values(wedges);
        d3.selectAll(wedgeElements).transition("arc")
            .duration(transitionDuration)
            .styleTween("d", function (_, index) {
                let wedge = this;
                let label = Object.keys(wedges)[index];
                let transition = transitionArc(wedge, label);
                return transition?.interpolator;
            })
            .ease(d3.easeLinear);
    }

    function getEmptyArc (label, data = pieData) {
        // Union of old and new labels in the order they appear
        let labels = d3.sort(new Set([...oldData, ...pieData].map(d => d.label)));
        let labelIndex = labels.indexOf(label);
        let sibling;
        for (let i = labelIndex - 1; i >= 0; i--) {
            sibling = data.find(d => d.label === labels[i]);
            if (sibling) {
                break;
            }
        }

        let angle = sibling?.endAngle ?? 0;
        return {startAngle: angle, endAngle: angle};
    }

    function arc (wedge) {
        let transition = transitionArc(wedge, label);

        return {
            duration: transitionDuration,
            css: (t, u) => {
                transition.interpolator(transition.type === "out" ? u : t);
            }
        }
    }

    function transitionArc (wedge, label) {
        label ??= Object.entries(wedges).find(([label, w]) => w === wedge)[0];

        let d = pieData.find(d => d.label === label);
        let d_old = oldData.find(d => d.label === label);

        if (sameArc(d_old, d)) {
            return null;
        }

        let from = d_old ? {...d_old} : getEmptyArc(label, oldData);
        let to = d ? {...d} : getEmptyArc(label, pieData);

        let angleInterpolator = d3.interpolate(from, to);

        let interpolator = t => `path("${ arcGenerator(angleInterpolator(t)) }")`;

        let type = d ? d_old ? "update" : "in" : "out";

        return {d, d_old, from, to, interpolator, type};
    }

    function sameArc(d_old, d) {
        if ((!d_old) || (!d)) {
            return true
        }
        else if ((d_old.startAngle == d.startAngle) && (d_old.endAngle == d.endAngle)) {
            return true
        }
        return false
    }


</script>


<div class="container">
    <svg viewBox="-50 -50 100 100">
        {#each pieData as d, index (d.label)}
            <path d={d.arc} fill={colors(d.id ?? d.label)} bind:this={wedges[d.label] } 
            transition:arc
            class:selected={selectedIndex === index}
            on:click={e => toggleWedge(index, e)} 
            on:keyup={e => toggleWedge(index, e)}
            tabindex="0" role="button" aria-label="select projects"/>
        {/each}
    </svg>

    <ul class="legend">
        {#each pieData as d, index (d.label)}
            <li style="--color: { colors(d.id ?? d.label) }" class="legend_item">
                <span class="swatch" class:selected={selectedIndex === index}></span>
                {d.label} <em>({d.value})</em>
            </li>
        {/each}
    </ul>
</div>


<style>
    /* d {
        transition: 300ms;
        transition-property: transform, opacity, fill;
    } */

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