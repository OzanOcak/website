"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = void 0;
const updateRole_1 = require("../../../services/updateRole");
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Get the user ID from the request parameters
    const { newRole } = req.body; // User's new role from the request body
    //console.log("userId :", userId, " newRole :", newRole);
    try {
        yield (0, updateRole_1.updateRole)(userId, newRole); // Call the service function with userId as a number
        res.status(200).json({ message: "User role updated successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            // Check if error is an instance of Error
            if (error.message === "Invalid role") {
                res.status(400).json({ message: "Invalid role" });
            }
            else if (error.message === "User not found") {
                res.status(404).json({ message: "User not found" });
            }
            else {
                console.error("Error updating role:", error);
                res.status(500).json({ message: "Error updating role" });
            }
        }
        else {
            // Handle unexpected error types
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.updateUserRole = updateUserRole;
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
