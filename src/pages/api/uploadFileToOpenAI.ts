import { v4 as uuidv4 } from "uuid";

import crypto from "crypto";
import { Readable } from "stream";

import fs from "fs";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

import { OpenAI } from "openai";

// export const config = {
//   api: {
//     bodyParser: false, // Disables automatic parsing of the request body
//   },
// };

// Define your API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const openAiApi = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      organization: process.env.NEXT_PUBLIC_OPENAI_ORGANIZATION_ID,
    });

    const randomUUID = uuidv4();

    fs.writeFile(`mydata.jsonl`, req.body, "utf8", (err) => {
      console.log(err);
    });

    const uploadResponse = await openAiApi.files.create({
      file: fs.createReadStream(`mydata.jsonl`, {
        encoding: "utf8",
      }),
      purpose: "fine-tune",
    });

    console.log("RESPONSE:", uploadResponse);
    return res.send(uploadResponse);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

// async function trainModel(data, openai) {
//   // Create a file from the Uint8Array data.
//   const file = await fs.promises.writeFile("mydata.jsonl", data);

//   // Upload the file to OpenAI.
//   const fileResponse = await openai.files.create({
//     file,
//     purpose: "fine-tune",
//   });

//   // Start the training process.
//   const trainingResponse = await openai.trainings.create({
//     fileId: fileResponse.id,
//   });

//   //   // Wait for the training to finish.
//   //   const trainingStatus = await openai.trainings.getStatus(trainingResponse.id);
//   //   while (trainingStatus.status !== "completed") {
//   //     await new Promise((resolve) => setTimeout(resolve, 1000));
//   //     trainingStatus = await openai.trainings.getStatus(trainingResponse.id);
//   //   }

//   // Return the trained model.
//   return openai.models.get(trainingResponse.modelId);
// }
