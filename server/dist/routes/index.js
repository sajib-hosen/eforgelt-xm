"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = require("../modules/users/user.route");
const bloodPost_route_1 = require("../modules/bloodPost/bloodPost.route");
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const donorRequest_route_1 = require("../modules/donorRequest/donorRequest.route");
const router = (0, express_1.Router)();
const routers = [
    {
        path: "/users",
        route: user_route_1.userRouter,
    },
    {
        path: "/blood-posts",
        route: bloodPost_route_1.bloodPostRouter,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRouters,
    },
    {
        path: "/request",
        route: donorRequest_route_1.donorRequestRouter,
    },
];
routers.forEach((route) => router.use(route.path, route.route));
exports.default = router;
