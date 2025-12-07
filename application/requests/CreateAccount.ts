import {AccountTypeEnum} from "../../domain/enums/AccountTypeEnum"; 

export interface CreateAccount {
    userId: string;                  
    accountType: AccountTypeEnum;    
    currency: string;                
    customAccountName?: string;      
    createdBy?: string; 
    parentAccountId?: number;
}