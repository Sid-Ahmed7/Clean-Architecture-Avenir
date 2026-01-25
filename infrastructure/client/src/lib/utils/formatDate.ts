export const formatDate = (date: string) => {
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

export const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}