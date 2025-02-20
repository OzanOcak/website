import { Request, Response } from "express";
import { updateName } from "../../../services/updateName";

export const updateUserSelfName = async (
  req: Request<{ userId: string }>,
  res: Response
): Promise<void> => {
  const { userId } = req.params; // Get the user ID from the request parameters
  const { newName } = req.body; // User's new role from the request body
  //console.log("userId :", userId, " newRole :", newRole);

  try {
    await updateName(userId, newName); // Call the service function with userId as a number

    res.status(200).json({ message: "User name updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating role" });
  }
};

/*
1- admin Page render components
2- clicking delete button call react query hook that makes http call with 
   patch(`/admin/${userId}/role`,{ newRole },{headers ...
3- server's route is executed that is
    router.patch(
      "/admin/:userId/role",
       authenticate,
       checkPermissionsToAuthorize("edit_user_role"),
       updateUserRole
    );
4- updateUserRole api end is called by the route
5- updateUserRole gets userId from req parameter and newRole from request body then pass them to 
updateRole function that is a service provider
6- updateRole make database query
7- if updateRole doest give any error, updateUserRole api end returns 200 success code to http 
request is made in the client
*/
