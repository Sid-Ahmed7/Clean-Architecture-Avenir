import express from 'express'
import { AccountController } from '../controller/account.controller'
import { InMemoryAccountRepository } from '../../../../adapters/repositories/InMemoryAccountRepository'
import { GenerateAccountNumberService } from '../../../../adapters/services/GenerateAccountNumberService'
import { GenerateIbanService } from '../../../../adapters/services/GenerateIbanService'
import { accountRepository } from './inMemoryInstance';

const router = express.Router();
const accountNumberGenerator = new GenerateAccountNumberService(accountRepository);
const ibanGenerator = new GenerateIbanService(accountRepository);
const accountController = new AccountController(accountRepository, accountNumberGenerator, ibanGenerator);

router.post("/create", (req, res) => accountController.createAnAccount(req,res));
router.put("/update", (req,res) => accountController.updateAccount(req,res));
router.get("/:accountNumber", (req,res) => accountController.getAccount(req,res));
router.get("/", (req,res) => accountController.getAllAccount(req,res));
router.delete("/:accountNumber", (req,res) => accountController.deleteAccount(req,res));
router.get("/iban/:iban", (req,res) => accountController.getAccountByIban(req,res));
router.put("/:accountNumber/status", (req,res) => accountController.changeStatusOfAccount(req,res));
router.put("/:accountNumber/name", (req,res) => accountController.updateAccountName(req,res));
router.put("/:accountNumber/withdrawal-limit", (req,res) => accountController.updateWithdrawalLimit(req,res));
router.put("/:accountNumber/transfer-limit", (req,res) => accountController.updateTransferLimit(req,res));
router.put("/:accountNumber/overdraft-limit", (req,res) => accountController.updateOverdraftLimit(req,res));
router.put("/:accountNumber/active", (req,res) => accountController.toggleAccountActive(req,res));


export default router;