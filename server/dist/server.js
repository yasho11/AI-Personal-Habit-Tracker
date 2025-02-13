"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 5000;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello typescrip here");
});
app.listen(PORT, () => {
    console.log(`Server running on : http://localhost:${PORT}`);
});
