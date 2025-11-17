import dotenv from "dotenv";
dotenv.config();
console.log("CLIENT_ID carregado:", process.env.PDF_SERVICES_CLIENT_ID);

import { fillDocxTemplate } from "./fillTemplate.js";
import { convertDocxToPdf } from "./generatePdf.js"; // Agora usa o SDK

async function main() {
    const filledDocx = "./output/doc-preenchido.docx";
    const outputPdf = "./output/resultado.pdf";

    fillDocxTemplate("./data/filmes.json", "./templates/template-filmes.docx", filledDocx);

    await convertDocxToPdf(filledDocx, outputPdf);
}

main();