import {
  Text,
  Badge,
  Center,
  Divider,
  Title,
  ActionIcon,
  Button,
  Modal,
  TextInput,
  Anchor,
  Loader,
  Box,
} from "@mantine/core";
import SidebarWrapper from "../components/dashboard/SidebarWrapper";
import {
  fetchWithJWT,
  getEnvironmentServerUrl,
  showCustomToast,
} from "../utils";
import { useAsyncFn, useEffectOnce } from "react-use";
import { useContext, useEffect, useState } from "react";

import { FinetuneJob, SessionObject } from "../utils/interfaces";
import moment from "moment";
import { showFinetuneJobBadge } from "../components/helpers";
import OpenAI from "openai";
import { Prism } from "@mantine/prism";
import {
  IconEdit,
  IconBrandNodejs,
  IconBrandPython,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";
import { SessionContext } from "../components/sessionProvider";

const FinetuneJobsPage = () => {
  const [currentJobOpen, setCurrentJobOpen] =
    useState<OpenAI.FineTuning.Jobs.FineTuningJob>(null);

  const [opened, { open, close }] = useDisclosure(false);

  const [session, _]: [session: SessionObject, _: any] =
    useContext(SessionContext);

  // @ts-expect-error
  const [state, doFetch]: [
    state: {
      loading: boolean;
      error?: string;
      value: { jobs: { data: OpenAI.FineTuning.Jobs.FineTuningJob[] } };
    },
    doFetch: any
  ] = useAsyncFn(async () => {
    const response = await fetchWithJWT(
      `${getEnvironmentServerUrl()}/finetuneJobs`
    );
    const result = await response.json();
    return result;
  }, []);

  useEffect(() => {
    doFetch();
  }, []);

  return (
    <>
      <Head>
        <title>Fine-tuning Jobs – ModelTuner</title>
      </Head>
      <SidebarWrapper>
        <Modal
          trapFocus={false}
          withCloseButton={false}
          size="lg"
          opened={opened}
          onClose={close}
          // title={
          //   <Title order={3} fw={700}>
          //     Model:{" "}
          //     <span style={{ fontWeight: 400 }}>{currentModelOpen?.id}</span>
          //   </Title>
          // }
        >
          <Center sx={{ justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, fontSize: 16 }}>
              Started running at:
            </span>{" "}
            <Text size={16}>
              {moment(currentJobOpen?.created_at * 1000).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </Text>
          </Center>
          {currentJobOpen?.finished_at && (
            <Center sx={{ justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                Finished running at:
              </span>{" "}
              <Text size={16}>
                {moment(currentJobOpen?.finished_at * 1000).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}
              </Text>
            </Center>
          )}

          <Center sx={{ justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, fontSize: 16 }}>
              Fine-tuning job ID:
            </span>{" "}
            <Text size={16}>{currentJobOpen?.id}</Text>
          </Center>
          <Center sx={{ justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, fontSize: 16 }}>
              Number of epochs:
            </span>{" "}
            <Text size={16}>{currentJobOpen?.hyperparameters?.n_epochs}</Text>
          </Center>
          <Center sx={{ justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, fontSize: 16 }}>Base model:</span>{" "}
            <Text size={16}>{currentJobOpen?.model}</Text>
          </Center>
          {currentJobOpen?.fine_tuned_model && (
            <Center sx={{ justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                Output model ID:
              </span>{" "}
              <Text size={16}>{currentJobOpen?.fine_tuned_model}</Text>
            </Center>
          )}
          {/* @ts-expect-error */}
          {currentJobOpen?.error && (
            <Center sx={{ justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>Error:</span>{" "}
              <Text color="red" size={16}>
                {/* @ts-expect-error */}
                {currentJobOpen?.error}
              </Text>
            </Center>
          )}
          <Center sx={{ justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, fontSize: 16 }}>Status</span>{" "}
            <Text size={16}>
              {showFinetuneJobBadge(currentJobOpen?.status, "filled")}
            </Text>
          </Center>
          <Divider my={10} size={1} />
          <Button mt={10} fullWidth onClick={close}>
            Done
          </Button>
        </Modal>
        {/* <Center>

      </Center> */}
        <Title order={2}>Fine-tuning jobs</Title>
        <Text size="sm" mt={5} color="dimmed">
          You can also check out your fine-tuning jobs directly on{" "}
          <Anchor href="https://platform.openai.com/finetune" target="_blank">
            OpenAI's website
          </Anchor>
          .
        </Text>
        <Divider my={10} />
        {state?.value?.jobs?.data && !state?.value?.jobs.data?.length && (
          <Title order={3}>No fine-tune jobs have been created</Title>
        )}

        {!session?.user?.openAiApiKey && (
          <Box>
            <Title order={3} mt={10}>
              You must set your OpenAI API key first to start running
              fine-tuning jobs
            </Title>
            <Text>You can set your API key under your 'Account' page</Text>
          </Box>
        )}
        {state?.value ? (
          state?.value?.jobs?.data
            ?.sort((a, b) => b.created_at - a.created_at)
            .map((job, i) => (
              <Center
                onClick={() => {
                  setCurrentJobOpen(job);
                  open();
                }}
                key={i}
                sx={(t) => ({
                  justifyContent: "space-evenly",
                  display: "inline-flex",
                  marginRight: "1%",
                  marginTop: "1.5%",
                  width: "24%",
                  height: 125,
                  border: "0.5px solid gray",
                  flexDirection: "column",
                  borderRadius: 10,
                  boxShadow: "0px 0px 5px lightgray",
                  background: "white",
                  "&:hover": {
                    cursor: "pointer",
                    background: t.colors.gray[1],
                  },
                })}
              >
                <Title
                  order={4}
                  align="center"
                  sx={{
                    width: "90%",
                    textOverflow: "clip",
                    overflowX: "scroll",
                    whiteSpace: "nowrap",
                  }}
                >
                  {job?.id}
                </Title>
                {showFinetuneJobBadge(job?.status, "filled")}

                {/* show when it was finished if it is, and if not, show how long it's been running */}
                {job?.finished_at ? (
                  <Text>
                    Finished{" "}
                    {moment(job?.finished_at * 1000)
                      .startOf("minutes")
                      .fromNow()}
                  </Text>
                ) : (
                  <Text>
                    Started{" "}
                    {moment(job?.created_at * 1000)
                      .startOf("minutes")
                      .fromNow()}
                  </Text>
                )}
                {/* {file.status} */}
              </Center>
              // <Center
              //   onClick={() => {
              //     open();
              //     // setCurrentFileOpen(file);
              //   }}
              //   key={i}
              //   sx={(t) => ({
              //     justifyContent: "space-evenly",
              //     display: "inline-flex",
              //     marginRight: "1%",
              //     marginTop: "1.5%",
              //     width: "24%",
              //     height: 125,
              //     border: "0.5px solid gray",
              //     flexDirection: "column",
              //     borderRadius: 10,
              //     boxShadow: "0px 0px 5px lightgray",
              //     background: "white",
              //     "&:hover": { cursor: "pointer", background: t.colors.gray[1] },
              //   })}
              // >
              //   <Title order={4}>{job.id}</Title>
              // </Center>
            ))
        ) : (
          <Center sx={{ height: "60vh" }}>
            <Loader size="xl" color="black" />
          </Center>
        )}
      </SidebarWrapper>
    </>
  );
};
export default FinetuneJobsPage;
