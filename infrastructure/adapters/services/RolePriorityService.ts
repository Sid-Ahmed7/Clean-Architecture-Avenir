import { RoleEnum } from "../../../domain/enums/RoleEnum";

/**
 * Service pour gérer la priorité des rôles utilisateur
 * Hiérarchie: BANK_MANAGER > BANK_ADVISOR > CLIENT
 */
export class RolePriorityService {
    private readonly rolePriority: Record<RoleEnum, number> = {
        [RoleEnum.BANK_MANAGER]: 3,
        [RoleEnum.BANK_ADVISOR]: 2,
        [RoleEnum.CLIENT]: 1,
    };

    /**
     * Retourne le rôle avec la plus haute priorité parmi une liste de rôles
     * @param roleNames - Liste des noms de rôles
     * @returns Le rôle avec la plus haute priorité, ou undefined si la liste est vide
     */
    public getHighestPriorityRole(roleNames: string[]): string | undefined {
        if (!Array.isArray(roleNames) || roleNames.length === 0) {
            return undefined;
        }

        // Filtrer les rôles valides et les trier par priorité décroissante
        const validRoles = roleNames.filter(role => 
            Object.values(RoleEnum).includes(role as RoleEnum)
        ) as RoleEnum[];

        if (validRoles.length === 0) {
            // Fallback: retourner le premier rôle si aucun n'est reconnu
            return roleNames[0];
        }

        // Trier par priorité et retourner le plus haut
        return validRoles.sort((a, b) => 
            this.rolePriority[b] - this.rolePriority[a]
        )[0];
    }

    /**
     * Vérifie si un rôle a une priorité plus élevée qu'un autre
     * @param role1 - Premier rôle
     * @param role2 - Deuxième rôle
     * @returns true si role1 a une priorité plus élevée que role2
     */
    public hasHigherPriority(role1: RoleEnum, role2: RoleEnum): boolean {
        return this.rolePriority[role1] > this.rolePriority[role2];
    }

    /**
     * Retourne la priorité numérique d'un rôle
     * @param role - Le rôle
     * @returns La priorité numérique (plus élevé = plus important)
     */
    public getRolePriority(role: RoleEnum): number {
        return this.rolePriority[role] || 0;
    }
}
