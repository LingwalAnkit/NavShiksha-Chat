import prisma from "../libs/prismadb";
import getSession from "./getSession";

const getCurrentUser = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      console.log("No session or user email found");
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      console.log("No user found with the provided email");
      return null;
    }

    return currentUser;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
};

export default getCurrentUser;