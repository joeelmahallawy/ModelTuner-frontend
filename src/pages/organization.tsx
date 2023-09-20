import { Divider, Title, Text, Center, Loader } from "@mantine/core";
import SidebarWrapper from "../components/dashboard/SidebarWrapper";
import { useContext, useEffect } from "react";
import { SessionContext } from "../components/sessionProvider";
import { SessionObject } from "../utils/interfaces";
import { useAsyncFn } from "react-use";
import { fetchWithJWT, getEnvironmentServerUrl } from "../utils";

const OrganizationPage = () => {
  return null;
  // const [session, _]: [session: SessionObject, _: any] =
  //   useContext(SessionContext);

  // // @ts-expect-error
  // const [state, doFetch]: [
  //   state: {
  //     loading: boolean;
  //     error?: string;
  //     value: { organization: Organization };
  //   },
  //   doFetch: any
  // ] = useAsyncFn(async () => {
  //   const response = await fetchWithJWT(
  //     `${getEnvironmentServerUrl()}/myOrganization`
  //   );
  //   const result = await response.json();
  //   return result;
  // }, []);

  // useEffect(() => {
  //   doFetch();
  // }, []);

  // if (state.loading || !state?.value) {
  //   return (
  //     <Center sx={{ height: "80vh" }}>
  //       <Loader color="black" size="xl" />
  //     </Center>
  //   );
  // }
  // return (
  //   !state?.loading &&
  //   state?.value && (
  //     <SidebarWrapper>
  //       <Title order={2}>Organization page</Title>
  //       <Divider mt={10} />
  //       <Text mt={5}>
  //         This organization currently has{" "}
  //         {state?.value?.organization?.OrganizationMembers?.length} members
  //       </Text>

  //       {state?.value?.organization?.OrganizationMembers?.map((member) => (
  //         <Center>{/* {member.} */}</Center>
  //       ))}
  //     </SidebarWrapper>
  //   )
  // );
};
export default OrganizationPage;
