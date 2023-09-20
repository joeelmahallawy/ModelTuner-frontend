import { Center, Divider, Title } from "@mantine/core";
import SidebarWrapper from "../components/dashboard/SidebarWrapper";
import { fetchWithJWT, getEnvironmentServerUrl } from "../utils";
import { useAsyncFn, useEffectOnce } from "react-use";
import { useEffect } from "react";

import { FinetuneJob } from "../utils/interfaces";

const FinetuneJobsPage = () => {
  // @ts-expect-error
  const [state, doFetch]: [
    state: {
      loading: boolean;
      error?: string;
      value: { jobs: { data: FinetuneJob[] } };
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

  console.log(state);

  return (
    <SidebarWrapper>
      <Title order={2}>Fine-tuning jobs</Title>
      <Divider my={10} />
      {state?.value?.jobs?.data && !state?.value?.jobs.data?.length && (
        <Title order={3}>No fine-tune jobs have been created</Title>
      )}
      {state?.value?.jobs?.data
        ?.sort((a, b) => b.created_at - a.created_at)
        .map((job, i) => (
          <Center
            onClick={() => {
              open();
              // setCurrentFileOpen(file);
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
              "&:hover": { cursor: "pointer", background: t.colors.gray[1] },
            })}
          >
            <Title order={4}>{job.id}</Title>
          </Center>
        ))}
    </SidebarWrapper>
  );
};
export default FinetuneJobsPage;
