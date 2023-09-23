import { deleteCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";

const LogoutPage = () => {
  return null;
};
export default LogoutPage;

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  // remove cookies
  deleteCookie("jwt", { req, res });

  return { redirect: { destination: `/`, permanent: false } };
};
