import express from 'express'
import { AccountController } from '../controller/account.controller'

const router = express.Router();
const accountController = new AccountController();

router.post("/create", (req, res) => accountController.createAnAccount(req,res));
router.put("/update", (req,res) => accountController.updateAccount(req,res));
router.get("/:accountNumber", (req,res) => accountController.getAccount(req,res));
router.get("/", (req,res) => accountController.getAllAccount(req,res));
router.delete("/:accountNumber", (req,res) => accountController.deleteAccount(req,res));
router.patch("/:accountNumber/status", (req,res) => accountController.changeStatusOfAccount(req,res));

export default router;