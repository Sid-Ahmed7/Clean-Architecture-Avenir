import {BeneficiaryGroupIdValue} from "../values/BeneficiaryGroupIdValue";
import {UserIdValue} from "../values/UserIdValue";
import {GroupNameValue} from "../values/GroupNameValue";


export class BeneficiaryGroupEntity {
  public static from(groupId: string,userId: string,groupName: string,beneficiaryIds: string[] = [],createdAt: Date = new Date(),updatedAt: Date = new Date()
  ) {
    const validatedGroupId = BeneficiaryGroupIdValue.from(groupId);
    if (validatedGroupId instanceof Error) return validatedGroupId;

    const validatedUserId = UserIdValue.from(userId);
    if (validatedUserId instanceof Error) return validatedUserId;

    const validatedGroupName = GroupNameValue.from(groupName);
    if (validatedGroupName instanceof Error) return validatedGroupName;

    return new BeneficiaryGroupEntity(validatedGroupId.value,validatedUserId.value,validatedGroupName.value,beneficiaryIds,createdAt,updatedAt);
  }

  private constructor(
    public readonly groupId: string,
    public readonly userId: string,
    public groupName: string,
    public beneficiaryIds: string[],
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  public addBeneficiary(beneficiaryId: string): void {
    if (!this.beneficiaryIds.includes(beneficiaryId)) {
      this.beneficiaryIds.push(beneficiaryId);
      this.updatedAt = new Date();
    }
  }

  public removeBeneficiary(beneficiaryId: string): void {
    this.beneficiaryIds = this.beneficiaryIds.filter(id => id !== beneficiaryId);
    this.updatedAt = new Date();
  }

  public updateGroupName(groupName: string): void {
    this.groupName = groupName;
    this.updatedAt = new Date();
  }
  public getBeneficiaryCount(): number {
    return this.beneficiaryIds.length;
  }
}