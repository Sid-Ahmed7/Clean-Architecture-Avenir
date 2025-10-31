import { Request, Response } from "express";
import { InMemoryNotificationRepository } from "../../../../adapters/repositories/InMemoryNotificationRepository";
import { NotificationPublisher, SseClient} from "../../../../../application/ports/services/notification/NotificationPublisher";
import {CreateNotificationUseCase} from "../../../../../application/usecases/notification/CreateNotificationUseCase";
import {GetUserNotificationUseCase} from "../../../../../application/usecases/notification/GetUserNotificationUseCase";
import {MarkNotificationAsReadUseCase} from "../../../../../application/usecases/notification/MarkNotificationAsReadUseCase";
import {DeleteNotificationUseCase} from "../../../../../application/usecases/notification/DeleteNotificationUseCase";
import { InvalidNotificationError } from "../../../../../domain/errors/InvalidNotificationError";
import { InvalidUserIdError } from "../../../../../domain/errors/InvalidUserIdError";
import { NotificationNotFoundError } from "../../../../../application/errors/notification/NotificationNotFoundError";



export class NotificationController {
    public constructor(
        private notificationRepository: InMemoryNotificationRepository,
        private notificationService: NotificationPublisher

    ){}


    public async createNotification(req: Request, res: Response) {
        const createNotificationUseCase = new CreateNotificationUseCase(this.notificationRepository);
        const userId = req.user?.userId;
        const {message, type} = req.body;
        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

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
        const notification = req.body.notification;
        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const result = await markNotificationAsReadUseCase.execute(notification);

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

        const notificationId = Number(req.params.id);

        const result = await deleteNotificationUseCase.execute(notificationId);
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
            "Access-Control-Allow-Origin": "*",
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
            this.notificationService.unsubscribe(userId);
        });
    }






































}