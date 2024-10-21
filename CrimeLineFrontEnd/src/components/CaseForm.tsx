import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { BlobServiceClient } from '@azure/storage-blob';
import { Buffer } from 'buffer';

if (typeof global !== 'undefined') {
    global.Buffer = Buffer;
} else if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
}


interface FormData {
    id: string;
    caseName: string;
    type: string;
    description: string;
}

function CaseForm({ onSubmit }) {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<FormData, 'id'>>({
    caseName: '',
    type: '',
    description: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCase = { ...formData, id: uuidv4() };
    onSubmit(newCase);
    setFormData({
      caseName: '',
      type: '',
      description: ''
    });

    await createFolderWithDescription(newCase.caseName, newCase.description);

    navigate("/", { state: { formData: newCase } });
  };


    const sasToken = import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN;
    const accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
    const containerName = import.meta.env.VITE_AZURE_CONTAINER_CLIENT_NAME;
    if (!sasToken || !accountName) {
        throw new Error("Azure Storage SAS token or account name is not defined in environment variables.");
    }

    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const createFolderWithDescription = async (folderName: string, caseDescription: string) => {
        const descriptionBlobClient = containerClient.getBlockBlobClient(`${folderName}/casedescription.txt`);
        const content = caseDescription;
        const blobOptions = { blobHTTPHeaders: { blobContentType: "text/plain" } };
        await descriptionBlobClient.upload(content, content.length, blobOptions);
    };


    
    

  return (
    <div className='flex flex-grow justify-center p-0'>
      <form onSubmit={handleSubmit} className="flow-root rounded-lg border border-gray-200 pt-3 shadow-sm w-full mx-60 h-full">
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Case Name</dt>
            <dd className="text-gray-700 sm:col-span-2">
              <input
                type="text"
                name="caseName"
                value={formData.caseName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </dd>
          </div>
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Type</dt>
            <dd className="text-gray-700 sm:col-span-2">
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </dd>
          </div>
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Description</dt>
            <dd className="text-gray-700 sm:col-span-2">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </dd>
          </div>
          <div className="flex justify-center p-3">
            <button
              type="submit"
              className="inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring mb-2 "
            >
              Submit
            </button>
          </div>
        </dl>
      </form>
    </div>
  );
};

export default CaseForm;
