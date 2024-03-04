document.body.insertAdjacentHTML("afterbegin", `
	<label class="color-scheme">
		Theme: 
        <select class="color-scheme-selector">
            <option value="light dark">auto</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
		</select>
	</label>`
);

let select = document.querySelector(".color-scheme-selector");
select.addEventListener("input", function (event) {
	console.log("color scheme changed to", event.target.value);
    document.documentElement.style.setProperty("color-scheme", event.target.value);

    localStorage.colorScheme = event.target.value;
});

if ("colorScheme" in localStorage) {
    document.documentElement.style.setProperty("color-scheme", localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}