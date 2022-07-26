import axios from "axios";

export const pinJSONToIPFS = async ({ name, description, image }) => {
  const { data } = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      name,
      description,
      image,
    },
    {
      headers: {
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET_KEY,
      },
    }
  );

  return data.IpfsHash;
};

export const pinFileToIPFS = async (file, pinMetadata) => {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("pinataMetadata", JSON.stringify(pinMetadata));

  const { data } = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
      pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET_KEY,
    },
  });

  return data.IpfsHash;
};
