"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const cors_sites = [
    "http://localhost:3000",
    "https://blood-bank-frontend-blue.vercel.app",
];
app.use((0, cors_1.default)({
    origin: cors_sites,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    next();
});
app.use("/api/v1", routes_1.default);
app.use((req, res, next) => {
    console.log("Request Origin:", req.headers.origin);
    next();
});
app.get("/", (req, res) => {
    console.log("Request Origin:", req.headers.origin);
    res.send("Hello Blood Bank!");
});
app.use(globalErrorHandler_1.default);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", cors_sites);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "API NOT Found !",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found",
        },
    });
});
exports.default = app;
