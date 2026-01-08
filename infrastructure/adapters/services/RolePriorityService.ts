import { RoleEnum } from "../../../domain/enums/RoleEnum";


export class RolePriorityService {
    private readonly rolePriority: Record<RoleEnum, number> = {
        [RoleEnum.BANK_MANAGER]: 3,
        [RoleEnum.BANK_ADVISOR]: 2,
        [RoleEnum.CLIENT]: 1,
    };


    public getHighestPriorityRole(roleNames: string[]): string | undefined {
        if (!Array.isArray(roleNames) || roleNames.length === 0) {
            return undefined;
        }

        const validRoles = roleNames.filter(role => 
            Object.values(RoleEnum).includes(role as RoleEnum)
        ) as RoleEnum[];

        if (validRoles.length === 0) {
            return roleNames[0];
        }

        return validRoles.sort((a, b) => 
            this.rolePriority[b] - this.rolePriority[a]
        )[0];
    }

 
    public hasHigherPriority(role1: RoleEnum, role2: RoleEnum): boolean {
        return this.rolePriority[role1] > this.rolePriority[role2];
    }


    public getRolePriority(role: RoleEnum): number {
        return this.rolePriority[role] || 0;
    }
}
