import { AccountTypeEnum } from "../../../../domain/enums/AccountTypeEnum";

export interface CreateAccountDTO {
    userId: string;                  
    accountType: AccountTypeEnum;    
    currency: string;                
    customAccountName?: string;      
    createdBy?: string;  
}