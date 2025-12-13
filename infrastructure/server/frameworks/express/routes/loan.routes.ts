import express from "express";
import { verifyTokenAccess } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";
import { LoanController } from "../controller/loan.controller";
import {
  loanRequestRepository,
  userRepository,
  userRoleRepository,
  uuidService,
  accountRepository,
  loanConfigRepository,
  loanRepaymentScheduleRepository,
} from "../../../../adapters/config/repositories";

const router = express.Router();

const loanController = new LoanController(
  loanRequestRepository,
  userRepository,
  userRoleRepository,
  uuidService,
  accountRepository,
  loanConfigRepository,
  loanRepaymentScheduleRepository,
);

router.post(
  "/request",
  verifyTokenAccess,
  authorizeRoles([RoleEnum.CLIENT]),
  (req, res) => loanController.createLoanRequest(req, res),
);

router.get(
  "/advisor/requests",
  verifyTokenAccess,
  authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]),
  (req, res) => loanController.listForAdvisor(req, res),
);

router.get(
  "/client/requests",
  verifyTokenAccess,
  authorizeRoles([RoleEnum.CLIENT]),
  (req, res) => loanController.listForClient(req, res),
);

router.post(
  "/advisor/requests/:id/decision",
  verifyTokenAccess,
  authorizeRoles([RoleEnum.BANK_ADVISOR]),
  (req, res) => loanController.advisorDecision(req, res),
);

router.post(
  "/director/requests/:id/decision",
  verifyTokenAccess,
  authorizeRoles([RoleEnum.BANK_MANAGER]),
  (req, res) => loanController.directorDecision(req, res),
);

router.get(
  "/director/requests",
  verifyTokenAccess,
  authorizeRoles([RoleEnum.BANK_MANAGER]),
  (req, res) => loanController.listForDirector(req, res),
);

router.post(
  "/director/requests/:id/propose-rate",
  verifyTokenAccess,
  authorizeRoles([RoleEnum.BANK_MANAGER]),
  (req, res) => loanController.directorProposeRate(req, res),
);

router.post(
  "/client/requests/:id/respond",
  verifyTokenAccess,
  authorizeRoles([RoleEnum.CLIENT]),
  (req, res) => loanController.clientRespondProposal(req, res),
);

router.post(
  "/director/rate",
  verifyTokenAccess,
  authorizeRoles([RoleEnum.BANK_MANAGER]),
  (req, res) => loanController.setIndicativeRate(req, res),
);

router.get(
  "/rate",
  verifyTokenAccess,
  (req, res) => loanController.getIndicativeRate(req, res),
);

router.get(
  "/client/repayments",
  verifyTokenAccess,
  authorizeRoles([RoleEnum.CLIENT]),
  (req, res) => loanController.listClientRepayments(req, res),
);

router.get(
  "/client/:id/info",
  verifyTokenAccess,
  authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]),
  (req, res) => loanController.getClientInfo(req, res),
);

export default router;

