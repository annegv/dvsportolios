console.log("IT’S ALIVE!");

function $$ (selector, context = document) {
	return Array.from(context.querySelectorAll(selector));
}

let navLinks = $$("nav a");
let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);

if (currentLink) { // or if (currentLink !== undefined)
	currentLink.classList.add("current");
}

let pages = [
	{url: ".", title: "home"},
	{url: "projects", title: "projects"},
    {url: "cv", title: "resume"},
    {url: "contact", title: "contact"},
    {url: "https://github.com/annegv", title: "github"}
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
	let url = p.url;
	let title = p.title;

    let a = document.createElement("a");
    a.href = url;
    a.textContent = title;
    nav.append(a);

    a.classList.toggle("current", a.host === location.host && a.pathname === location.pathname);
    
    if (a.host !== location.host) {
        a.target = "_blank";
    }    
}

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