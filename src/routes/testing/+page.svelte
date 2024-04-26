<script>
    import * as d3 from 'd3';

    let cost_burden = true;
    let commute_time = false;
    let education = false;
    let race = true;
    let commute_type = true;
    let income = false;
    let employment = false;

    import cost_burden_data from './proj_data/cost_burden.json';
    import commute_time_data from './proj_data/commute_time.json';
    import education_data from './proj_data/edu_attainment.json';
    import race_data from './proj_data/race.json';
    import commute_type_data from './proj_data/commute_type.json';
    import income_data from './proj_data/income.json';
    import employment_data from './proj_data/income.json';

    let metric_bools = [cost_burden, commute_time, education, race, commute_type, income, employment];
    let metric_data = [cost_burden_data, commute_time_data, education_data, race_data, commute_type_data, income_data, employment_data];
    let metric_munis = Object.fromEntries(Object.entries(cost_burden_data).map(([k,v]) => [v.municipal, 0]));

    for(var i = 0; i < 7; i++) {
        let cur_bool = metric_bools[i];
        let cur_data = metric_data[i];

        cur_data.forEach(function(element){
            let municipal_name = element['municipal'];
            metric_munis[element['municipal']] = metric_munis[element['municipal']] + element['rank'] * cur_bool;
        });
    }

    let metric_munis_reversed = Object.keys(metric_munis).map(function(key) {
        return [key, metric_munis[key]];
    });
    metric_munis_reversed.sort(function(first, second) {
        return second[1] - first[1];
    }).reverse();

    let top5_munis_pre = metric_munis_reversed.slice(0, 5);
    let top5_munis = [];

    for(var j = 0; j < top5_munis_pre.length; j++) {
        top5_munis.push(top5_munis_pre[j][0])
    }
</script>

<svelte:head>
	<title>testing</title>
</svelte:head>

<h1>testing</h1>