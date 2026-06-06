let pdfCurrent = "";

/* ACTIVE */
function setActive(el){
    document.querySelectorAll(".menu-item").forEach(i=>{
        i.classList.remove("active");
    });
    el.classList.add("active");
}

/* SIDEBAR */
function openSidebar(){
    document.getElementById("sidebar").classList.add("active");
    document.getElementById("overlay").classList.add("active");
}

function closeSidebar(){
    document.getElementById("sidebar").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
}

function toggleSidebar(){
    document.getElementById("sidebar").classList.contains("active")
        ? closeSidebar()
        : openSidebar();
}

/* PAGE */
function showPage(page){

let content = "";

if(page === "home"){
content = `
<div class="header">
    <div class="hamburger" onclick="toggleSidebar()">☰</div>
    <div class="logo">Sembang Maths</div>
</div>

<div class="card">Welcome ke Sembang Maths</div>

<div class="home-social">
    <div class="social-icon">
        <span class="material-symbols-rounded">play_circle</span>
        <div>YouTube</div>
    </div>
    <div class="social-icon">
        <span class="material-symbols-rounded">send</span>
        <div>Telegram</div>
    </div>
    <div class="social-icon">
        <span class="material-symbols-rounded">music_note</span>
        <div>TikTok</div>
    </div>
</div>
`;
}

if(page === "video"){
content = `
<div class="header">
    <div class="hamburger" onclick="toggleSidebar()">☰</div>
    <div class="logo">Video</div>
</div>

<div class="card">Video page</div>
`;
}

if(page === "pdf"){
content = `
<div class="header">
    <div class="hamburger" onclick="toggleSidebar()">☰</div>
    <div class="logo">PDF</div>
</div>

<div id="pdfList" class="card">Loading PDF...</div>
`;

document.getElementById("app").innerHTML = content;
closeSidebar();
loadPDF();
return;
}

document.getElementById("app").innerHTML = content;
closeSidebar();
}

/* INIT */
document.addEventListener("DOMContentLoaded", async () => {

    showPage("home"); // pindahkan sini

    const hash = location.hash;

    if(!hash.startsWith("#pdf=")) return;

    const slug = hash.replace("#pdf=","");

    const url = "https://opensheet.elk.sh/1_Z68XSNfKmu9kuhISkJDqS03lK7dGbuoeZFfqL1edY4/pdf";

    const res = await fetch(url);
    const data = await res.json();

    const item = data.find(x => x.Slug === slug);

    if(item){
        showPage("pdf");
        setTimeout(()=> openPDF(item.Link, item.Slug), 500);
    }
});

/* LOAD PDF */
async function loadPDF(){

const url = "https://opensheet.elk.sh/1_Z68XSNfKmu9kuhISkJDqS03lK7dGbuoeZFfqL1edY4/pdf";

try {
    const res = await fetch(url);
    const data = await res.json();

    let html = "";

    data.forEach(item => {
   html += `
    <div class="pdf-card">

        <div onclick="openPDF('${item.Link}','${item.Slug}')" style="flex:1; display:flex; gap:14px; align-items:center;">

            <div class="pdf-icon">
                <span class="material-symbols-rounded">picture_as_pdf</span>
            </div>

            <div class="pdf-info">
                <div class="pdf-title">${item.Title}</div>
                <div class="pdf-author">${item.Author}</div>
            </div>

        </div>

        <div class="pdf-arrow" onclick="copyLink('${item.Slug}')">
            <span class="material-symbols-rounded">link</span>
        </div>

    </div>
`;
});

    document.getElementById("pdfList").innerHTML = html;

} catch (err) {
    document.getElementById("pdfList").innerHTML =
        "Gagal load PDF data";
}
}

/* OPEN PDF */
function openPDF(link, slug){

if(!link) return;

let id = link.match(/[-\w]{25,}/);

let view = id 
    ? `https://drive.google.com/file/d/${id[0]}/preview`
    : link;

pdfCurrent = view.replace("/preview", "/view");

if(slug){
    location.hash = "pdf=" + slug;
}

document.getElementById("pdfFrame").src = view;
document.getElementById("pdfModal").style.display = "flex";
}

/* CLOSE PDF */
function closePDF(){
    document.getElementById("pdfModal").style.display = "none";
    document.getElementById("pdfFrame").src = "";
}

/* DOWNLOAD PDF */
function openTabPDF(){
    if(!pdfCurrent) return;
    window.open(pdfCurrent, "_blank");
}

function copyLink(slug){
    const link = window.location.origin + "#pdf=" + slug;
    navigator.clipboard.writeText(link);
    alert("Link copied!");
}
