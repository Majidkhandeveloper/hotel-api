// import { Request, Response, NextFunction } from "express";
// import { HttpUrl } from "../utils/BaseUrl";
// import { ErrorMessage } from "../utils/ErrorMessage";

// export const userPermissions = (url: string) => {  
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userPermissionResponse = await HttpUrl.post("/find-user-permission", {
//         user_id: req.user?.user_id,
//         permission_url: url
//       });

//       // const userTypePermissionResponse = await HttpUrl.post("/find-type-permission", {
//       //   user_type_id: req.user?.role_id,
//       //   permission_url: url
//       // });
//       // userTypePermissionResponse.user_type_id
//       if (req.user?.role_id === 1 || req.user?.role_id === 6) {
//         // User has the highest role and can proceed
//         return next();
//       } else if (
//         // userTypePermissionResponse.data?.status === "fail" ||
//         userPermissionResponse.data?.status === "fail"
//       ) {
//         return ErrorMessage(res, "You are not allowed to perform this action", 403);
//       }
//       return next();
//     } catch (error) { 
//       console.error("Error occurred:", error);
//       return ErrorMessage(res, "Internal Server Error", 500);
//     }
//   };
// };
