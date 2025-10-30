import {Advisor} from "@/types/Advisor";

export const getTimeAgo = (date: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 60) {
        return `Il y a ${minutes} min`;
    } 
    if (hours < 24){
        return `Il y a ${hours}h`;
    } 
    return `Il y a ${Math.floor(hours / 24)} jours`;
}

export const getNameAdvisor = (advisor: Advisor) => {
  return `${advisor.firstName || ""} ${advisor.lastName || ""}`.trim() || advisor.email;
};
