import { Request, Response } from "express";
import { NotificationPublisher, SseClient} from "../../../../../application/ports/services/notification/NotificationPublisher";
import {CreateNotificationUseCase} from "../../../../../application/usecases/notification/CreateNotificationUseCase";
import {GetUserNotificationUseCase} from "../../../../../application/usecases/notification/GetUserNotificationUseCase";
import {SendNotificationToClientUseCase} from "../../../../../application/usecases/notification/SendNotificationToClientUseCase";
import {MarkNotificationAsReadUseCase} from "../../../../../application/usecases/notification/MarkNotificationAsReadUseCase";
import {DeleteNotificationUseCase} from "../../../../../application/usecases/notification/DeleteNotificationUseCase";
import { InvalidNotificationError } from "../../../../../domain/errors/InvalidNotificationError";
import { InvalidUserIdError } from "../../../../../domain/errors/InvalidUserIdError";
import { NotificationNotFoundError } from "../../../../../application/errors/notification/NotificationNotFoundError";
import { CryptoUuidGenerator } from "../../../../adapters/services/CryptoUuidGenerator";
import { createNotificationSchema } from "../schemas/notifications/createNotificationSchema";
import { sendNotificationToClientSchema } from "../schemas/notifications/sendNotificationToClientSchema";
import { markNotificationAsReadSchema } from "../schemas/notifications/markNotificationAsReadSchema";
import { userRepository } from "../../../../adapters/config/repositories";
import { NotificationRepositoryInterface } from "../../../../../application/ports/repositories/notification/NotificationRepositoryInterface";


export class NotificationController {
    public constructor(
        private readonly notificationRepository: NotificationRepositoryInterface,
        private readonly notificationService: NotificationPublisher,
        private readonly uuidService: CryptoUuidGenerator

    ){}

    public async createNotification(req: Request, res: Response) {
        const createNotificationUseCase = new CreateNotificationUseCase(this.notificationRepository, this.uuidService);
        const userId = req.user?.userId;

        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const parseResult = createNotificationSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.issues });
        }

        const {message, type} = parseResult.data;
        const result = await createNotificationUseCase.execute(userId, message, type);

        if (result instanceof Error) {
            if(result instanceof InvalidNotificationError) {
                return res.status(400).json({error : result.message})
            }
            if(result instanceof InvalidUserIdError){
                return res.status(401).json({error: result.message});
            }

            return res.status(500).json({error: result.message});
        }

        this.notificationService.sendNotification(userId, result)
        return res.status(201).json(result);
    }
        public async sendNotificationToClient (req: Request, res: Response) {
        const senderNotificationUseCase = new SendNotificationToClientUseCase(this.notificationRepository, this.notificationService, this.uuidService, userRepository);
        const advisorId = req.user?.userId;

        if(!advisorId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const parseResult = sendNotificationToClientSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.issues });
        }

        const {clientId, message, type} = parseResult.data;
        const result = await senderNotificationUseCase.execute(clientId, message, type, advisorId);

        if (result instanceof Error) {
            if(result instanceof InvalidNotificationError) {
                return res.status(400).json({error : result.message})
            }
            if(result instanceof InvalidUserIdError){
                return res.status(401).json({error: result.message});
            }

            return res.status(500).json({error: result.message});
        }
        
        return res.status(201).json(result);
    }

    public async  getUserNotification(req: Request, res: Response) {
        const getUserNotificationUseCase = new GetUserNotificationUseCase(this.notificationRepository);
         const userId = req.user?.userId;
        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const result = await getUserNotificationUseCase.execute(userId);

        if(result instanceof Error) {
            return res.status(500).json({error: result.message});
        }

        return res.status(200).json(result);
    }

    public async markNotificationAsRead(req: Request, res: Response) {
        const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(this.notificationRepository);
        const userId = req.user?.userId;

        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const parseResult = markNotificationAsReadSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.issues });
        }

        const { notificationId } = parseResult.data;
        const result = await markNotificationAsReadUseCase.execute(notificationId);

        if(result instanceof Error) {
            if(result instanceof NotificationNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error : result.message})
        }
        return res.status(200).json(result);
    }

    public async deleteNotification(req: Request, res: Response) {
        const deleteNotificationUseCase = new DeleteNotificationUseCase(this.notificationRepository);

        const notificationId = req.params.id;
        if(!notificationId) {
            return  res.status(404).json({error: "Notification not found"});

        }

        const result = await deleteNotificationUseCase.execute(notificationId as string);
        if(result instanceof Error) {
            if(result instanceof NotificationNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error : result.message})
        }
        return res.status(200).json(result);

    }

    public subscribe(req: Request, res: Response) {
        const userId = req.user?.userId;
        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        res.writeHead(200, {
            "Access-Control-Allow-Origin": `${process.env.CLIENT_BASE_URL}`,
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "text/event-stream",
            "Connection": "keep-alive",
            "Cache-Control": "no-cache"
        });

        const client: SseClient = {
            write: (data: string) => res.write(data),
            close: () => res.end(),
        };

        this.notificationService.subscribe(userId, client);

        req.on("close", () => {
            this.notificationService.unsubscribe(userId, client);
        });
    }






































}