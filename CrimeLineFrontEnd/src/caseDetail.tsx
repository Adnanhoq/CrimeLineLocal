import { useParams } from "react-router-dom";
import CrimeLineHeader from "./components/Header";
import CrimeLineFooter from "./components/Footer";
import { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";

if (typeof global !== "undefined") {
  global.Buffer = Buffer;
} else if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

function CaseDetail() {
  const { caseName } = useParams<{ caseName: string }>();

  const [files, setFiles] = useState<File[]>([]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Files to be uploaded:", files);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name;
      const fileContent = await file.arrayBuffer();
      let contentType = "";

      if (fileName.endsWith(".mp4")) {
        contentType = "video/mp4";
      } else if (fileName.endsWith(".mp3")) {
        contentType = "audio/mpeg";
      } else if (fileName.endsWith(".pdf")) {
        contentType = "application/pdf";
      } else {
        console.error("Unsupported file type:", fileName);
        continue;
      }

      await uploadWitnessStatements(
        caseName,
        fileName,
        Buffer.from(fileContent),
        contentType,
      );
      console.log("Uploaded:", fileName);
    }
  }

  const uploadWitnessStatements = async (
    folderName: string,
    fileName: string,
    fileContent: Buffer,
    contentType: string,
  ) => {
    const sasToken = import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN;
    const accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
    const containerName = import.meta.env.VITE_AZURE_CONTAINER_CLIENT_NAME;
    if (!sasToken || !accountName) {
      throw new Error(
        "Azure Storage SAS token or account name is not defined in environment variables.",
      );
    }

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`,
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    fileName = uuidv4() + "_" + fileName;
    const blobClient = containerClient.getBlockBlobClient(
      `${folderName}/witnessStatements/${fileName}`,
    );
    const blobOptions = { blobHTTPHeaders: { blobContentType: contentType } };
    await blobClient.upload(fileContent, fileContent.length, blobOptions);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <CrimeLineHeader
        title={caseName}
        showButton={true}
        navigatePath={"/"}
        buttonText={"Home"}
      />
      <div className="flex-grow flex flex-col p-10">
        <form onSubmit={handleSubmit}>
          <h3>
            <label>Upload your file(s):</label>
          </h3>
          <input type="file" multiple onChange={handleFileChange} />
          <button
            type="submit"
            className="rounded-md p-2 outline outline-1 hover:contrast-75"
          >
            Upload
          </button>
        </form>

        {files.length > 0 && (
          <div>
            <h3>Selected Files:</h3>
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <CrimeLineFooter />
    </div>
  );
}

export default CaseDetail;
