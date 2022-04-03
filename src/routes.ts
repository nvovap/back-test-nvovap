import { LoadPhotos } from "./controller/LoadPhotos";
import { GetPhotos } from "./controller/GetPhotos";
import { DeletePhoto } from "./controller/DeletePhoto";
import { DeleteAlbum } from "./controller/DeleteAlbum";
import { ChangeAlbumTitle } from "./controller/ChangeAlbumTitle";
import { Login } from "./controller/Login";
import { Register } from "./controller/Register";

/**
 * All application routes.
 */
export const AppRoutes = [
    {
        path: "/login",
        method: "post",
        action: Login
    },
    {
        path: "/register",
        method: "post",
        action: Register
    },
    {
        path: "/load-photos",
        method: "get",
        action: LoadPhotos
    },
    {
        path: "/get-photos",
        method: "get",
        action: GetPhotos
    },
    {
        path: "/change-album-title",
        method: "get",
        action: ChangeAlbumTitle
    },
    {
        path: "/delete-photo",
        method: "delete",
        action: DeletePhoto
    },
    {
        path: "/delete-album",
        method: "delete",
        action: DeleteAlbum
    }
];