import express from "express";
import { search } from "~/controllers/search.controller";

const router = express.Router();

router.get('/search', search)

export default router;
