import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export function fillDocxTemplate(jsonPath, templatePath, outputPath) {
    const templateBinary = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(templateBinary);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    try {
        doc.render(data);
    } catch (err) {
        console.error("Erro ao preencher template:", err);
        return;
    }

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(outputPath, buffer);

    console.log("DOCX preenchido:", outputPath)
}