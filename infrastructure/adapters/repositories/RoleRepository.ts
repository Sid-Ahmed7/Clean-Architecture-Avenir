import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { IRoleRepository } from "../../../application/usecases/auth/RegisterUseCase";

// This is a mock in-memory repository for demonstration purposes
// In a real application, this would connect to a database
export class RoleRepository implements IRoleRepository {
  // Pre-defined roles with IDs
  private roles = [
    { id: 1, name: RoleEnum.CLIENT },
    { id: 2, name: RoleEnum.BANK_ADVISOR },
    { id: 3, name: RoleEnum.BANK_MANAGER },
    { id: 4, name: RoleEnum.ADMIN }
  ];

  async findByName(name: RoleEnum): Promise<{ id: number, name: RoleEnum } | null> {
    const role = this.roles.find(r => r.name === name);
    return role || null;
  }

  async findById(id: number): Promise<{ id: number, name: RoleEnum } | null> {
    const role = this.roles.find(r => r.id === id);
    return role || null;
  }
}