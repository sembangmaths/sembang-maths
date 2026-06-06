let pdfCurrent = "";

/* ================= ACTIVE MENU ================= */
function setActive(el){
    document.querySelectorAll(".menu-item").forEach(i=>{
        i.classList.remove("active");
    });
    el.classList.add("active");
}

/* ================= SIDEBAR ================= */
function openSidebar(){
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if(sidebar) sidebar.classList.add("active");
    if(overlay) overlay.classList.add("active");
}

function closeSidebar(){
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if(sidebar) sidebar.classList.remove("active");
    if(overlay) overlay.classList.remove("active");
}

function toggleSidebar(){
    const sidebar = document.getElementById("sidebar");
    if(!sidebar) return;

    if(sidebar.classList.contains("active")){
        closeSidebar();
    } else {
        openSidebar();
    }
}

/* ================= PAGE NAVIGATION ================= */
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

        <div id="pdfList" class="card">Loading PDF...</div>
        `;

        app.innerHTML = content;
        closeSidebar();
        loadPDF();
        return;
    }

    app.innerHTML = content;
    closeSidebar();
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {

    showPage("home");

    const hash = location.hash;

    if(hash.startsWith("#pdf=")){

        const slug = hash.replace("#pdf=","");

        const url = "https://opensheet.elk.sh/1_Z68XSNfKmu9kuhISkJDqS03lK7dGbuoeZFfqL1edY4/pdf";

        fetch(url)
        .then(res => res.json())
        .then(data => {

            const item = data.find(x => x.Slug === slug);

            if(item){
                showPage("pdf");
                setTimeout(() => {
                    openPDF(item.Link, item.Slug);
                }, 300);
            }
        })
        .catch(err => {
            console.log("Hash load error:", err);
        });
    }
});

/* ================= LOAD PDF ================= */
async function loadPDF(){

    const url = "https://opensheet.elk.sh/1_Z68XSNfKmu9kuhISkJDqS03lK7dGbuoeZFfqL1edY4/pdf";

    try {
        const res = await fetch(url);
        const data = await res.json();

        let html = "";

        data.forEach(item => {
            html += `
            <div class="pdf-card">

                <div onclick="openPDF('${item.Link}','${item.Slug}')"
                     style="flex:1; display:flex; gap:14px; align-items:center;">

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

        const el = document.getElementById("pdfList");
        if(el) el.innerHTML = html;

    } catch (err) {
        const el = document.getElementById("pdfList");
        if(el) el.innerHTML = "Gagal load PDF data";
        console.log(err);
    }
}

/* ================= OPEN PDF ================= */
function openPDF(link, slug){

    if(!link) return;

    const id = link.match(/[-\w]{25,}/);

    const view = id
        ? `https://drive.google.com/file/d/${id[0]}/preview`
        : link;

    pdfCurrent = view.replace("/preview", "/view");

    if(slug){
        location.hash = "pdf=" + slug;
    }

    const frame = document.getElementById("pdfFrame");
    const modal = document.getElementById("pdfModal");

    if(frame) frame.src = view;
    if(modal) modal.style.display = "flex";
}

/* ================= CLOSE PDF ================= */
function closePDF(){
    const frame = document.getElementById("pdfFrame");
    const modal = document.getElementById("pdfModal");

    if(modal) modal.style.display = "none";
    if(frame) frame.src = "";
}

/* ================= DOWNLOAD PDF ================= */
function openTabPDF(){
    if(!pdfCurrent) return;
    window.open(pdfCurrent, "_blank");
}

/* ================= COPY LINK ================= */
function copyLink(slug){
    const link = window.location.origin + "#pdf=" + slug;
    navigator.clipboard.writeText(link);
    alert("Link copied!");
}
