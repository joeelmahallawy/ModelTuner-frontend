import { Prism } from "@mantine/prism";
import {
  Anchor,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { IconUpload, IconX, IconCodeDots } from "@tabler/icons-react";

import { Dispatch, SetStateAction, useState } from "react";

import { useRouter } from "next/router";
import {
  fetchWithJWT,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../../utils";
import FileUploadPage from "./fileUploadPage";
import FileStatusPage from "./fileStatusPage";

const UploadCustomTrainingData = ({
  setUploadMethod,
}: {
  setUploadMethod: Dispatch<
    SetStateAction<"" | "customData" | "conversationData">
  >;
}) => {
  const [pageActive, setPageActive] = useState(1);

  const [uploadedFileId, setUploadedFileId] = useState("");

  return (
    <Box>
      <Title order={2} mb={10}>
        Upload custom training data set
      </Title>
      <Divider my={10} />
      {pageActive === 1 && (
        <FileUploadPage
          // to go back to main paeg
          setUploadMethod={setUploadMethod}
          //   to go to next page
          setPageActive={setPageActive}
          //   set file ID so we can see status of file on page 2
          setUploadedFileId={setUploadedFileId}
        />
      )}

      {/*  */}
      {/*  */}
      {/* ACTIVE PAGE 2 FOR SEEING THE FILES STATUS */}
      {/*  */}
      {/*  */}
      {/*  */}

      {pageActive === 2 && <FileStatusPage uploadedFileId={uploadedFileId} />}
    </Box>
  );
};
export default UploadCustomTrainingData;

// <FileButton
//   onChange={(e) => {
//     //   // protection for cancellin file input after uploading a file
//     if (!e) return;
//     // const fileReader = new FileReader();
//     // fileReader.readAsText(e, "UTF-8");
//     // fileReader.onload = (e) => {
//     //   setChatGptConversations(
//     //     // @ts-expect-error
//     //     JSON.parse(`[${e.target.result.replaceAll("\n", ",")}]`)
//     //   );
//     // };
//   }}
//   accept=".json,.jsonl"
// >
//   {(props) => (
//     <Button {...props} color="cyan">
//       Upload custom training data
//     </Button>
//   )}
// </FileButton>
