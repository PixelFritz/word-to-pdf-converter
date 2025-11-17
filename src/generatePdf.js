import {
    ServicePrincipalCredentials,
    PDFServices,
    MimeType,
    CreatePDFJob,
    CreatePDFResult
} from "@adobe/pdfservices-node-sdk";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

export async function convertDocxToPdf(docxPath, outputPdf) {
    let readStream;
    try {
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
        });

        const pdfServices = new PDFServices({ credentials });

        console.log("📤 Upload DOCX para o Asset da Adobe...");
        
        readStream = fs.createReadStream(docxPath);
        const inputAsset = await pdfServices.upload({
            readStream,
            mimeType: MimeType.DOCX // MimeType correto para Word
        });

        const job = new CreatePDFJob({ inputAsset });

        console.log("⚙️ Criando job PDF...");
        const pollingURL = await pdfServices.submit({ job });

        console.log("⏳ Aguardando Adobe terminar...");
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: CreatePDFResult
        });

        const resultAsset = pdfServicesResponse.result.asset;
        const streamAsset = await pdfServices.getContent({ asset: resultAsset });

        console.log("⬇ Baixando PDF...");
        const outputStream = fs.createWriteStream(outputPdf);
        streamAsset.readStream.pipe(outputStream);

        await new Promise((resolve) => outputStream.on('finish', resolve));

        console.log(`🎉 PDF salvo: ${outputPdf}`);

    } catch (err) {
        console.error("❌ Erro no processo de conversão da Adobe:", err.message);
        throw err;
    } finally {
        readStream?.destroy();
    }
}