// ===============================
// SEMBANG MATHS GLOBAL PRELOAD
// ===============================


const PDF_API =
"https://script.google.com/macros/s/AKfycbxA1tFgvgFu7RBTFb-zoE9CIF06JW5t6X4d3VGyws62yJxHewGuLnyjGJj2pB-naaFM/exec";


// ===============================
// LOAD PDF DATA
// ===============================

async function preloadPDF(){

    const cache = localStorage.getItem("pdfData");


    if(cache){

        console.log("PDF cache sudah ada");
        return;

    }


    try{

        console.log("Download PDF data...");

        const res = await fetch(PDF_API);

        const data = await res.json();


        localStorage.setItem(
            "pdfData",
            JSON.stringify(data)
        );


        console.log(
            "PDF siap:",
            data.length
        );


    }catch(error){

        console.log(
            "PDF preload gagal",
            error
        );

    }

}


preloadPDF();