let pdfCurrent = "";

/* MENU */
function setActive(el){
    document.querySelectorAll(".menu-item").forEach(i=>{
        i.classList.remove("active");
    });
    el.classList.add("active");
}

/* SIDEBAR */
function openSidebar(){
    document.getElementById("sidebar")?.classList.add("active");
    document.getElementById("overlay")?.classList.add("active");
}

function closeSidebar(){
    document.getElementById("sidebar")?.classList.remove("active");
    document.getElementById("overlay")?.classList.remove("active");
}

function toggleSidebar(){
    const sb = document.getElementById("sidebar");
    if(!sb) return;
    sb.classList.toggle("active");
}

/* PAGE */
function showPage(page){

    const app = document.getElementById("app");
    if(!app) return;

    let content = "";

    if(page === "home"){
        content = `
        <div class="header">
            <div class="hamburger" onclick="toggleSidebar()">☰</div>
            <div class="logo">Sembang Maths</div>
        </div>

        <div class="card">Welcome ke Sembang Maths</div>
        `;
    }

    else if(page === "video"){
        content = `
        <div class="header">
            <div class="hamburger" onclick="toggleSidebar()">☰</div>
            <div class="logo">Video</div>
        </div>

        <div class="card">Video page</div>
        `;
    }

    else if(page === "pdf"){
        content = `
        <div class="header">
            <div class="hamburger" onclick="toggleSidebar()">☰</div>
            <div class="logo">PDF</div>
        </div>

        <div id="pdfList" class="card">Loading...</div>
        `;

        app.innerHTML = content;
        loadPDF();
        closeSidebar();
        return;
    }

    app.innerHTML = content;
    closeSidebar();
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
    showPage("home");
});

/* LOAD PDF */
async function loadPDF(){

    const url = "https://opensheet.elk.sh/1_Z68XSNfKmu9kuhISkJDqS03lK7dGbuoeZFfqL1edY4/pdf";

    try{
        const res = await fetch(url);
        const data = await res.json();

        let html = "";

        data.forEach(item=>{
            html += `
            <div class="pdf-card">
                <div style="flex:1;display:flex;gap:12px;align-items:center;"
                     onclick="openPDF('${item.Link}','${item.Slug}')">

                    <div class="pdf-icon">📄</div>

                    <div>
                        <div class="pdf-title">${item.Title}</div>
                        <div>${item.Author}</div>
                    </div>
                </div>

                <div onclick="copyLink('${item.Slug}')">🔗</div>
            </div>
            `;
        });

        document.getElementById("pdfList").innerHTML = html;

    } catch(e){
        document.getElementById("pdfList").innerHTML = "Error load PDF";
    }
}

/* OPEN PDF */
function openPDF(link, slug){

    if(!link) return;

    const id = link.match(/[-\w]{25,}/);

    const view = id
        ? `https://drive.google.com/file/d/${id[0]}/preview`
        : link;

    pdfCurrent = view;

    document.getElementById("pdfFrame").src = view;
    document.getElementById("pdfModal").style.display = "flex";
}

/* CLOSE */
function closePDF(){
    document.getElementById("pdfModal").style.display = "none";
    document.getElementById("pdfFrame").src = "";
}

/* DOWNLOAD */
function openTabPDF(){
    if(pdfCurrent) window.open(pdfCurrent, "_blank");
}

/* COPY */
function copyLink(slug){
    navigator.clipboard.writeText(location.origin + "#pdf=" + slug);
}
