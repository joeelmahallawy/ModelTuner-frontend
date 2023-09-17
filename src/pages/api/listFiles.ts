import { NextApiResponse } from "next";
import OpenAI from "openai";

const handler = async (req: NextApiResponse, res: NextApiResponse) => {
  const openAiApi = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    organization: process.env.NEXT_PUBLIC_OPENAI_ORGANIZATION_ID,
  });

  const allFilesUploaded = await openAiApi.files.list();

  const allFiles: OpenAI.FileObject[] = [];

  for await (const file of allFilesUploaded) {
    // await openAiApi.files.del(file.id);
    // const getFileContent = await openAiApi.files.retrieveContent(file.id);

    console.log(file);
    // allFiles.push(file);
  }

  return res.json({ files: allFiles });
};

export default handler;
