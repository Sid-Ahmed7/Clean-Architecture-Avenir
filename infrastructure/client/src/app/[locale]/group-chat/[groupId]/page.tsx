"use client";
import { useParams } from 'next/navigation';
import { GroupChatRoom } from './../../../../components/group-chat/GroupChatRoom';


export default function GroupChatPage() {
    const params = useParams();
    const groupId = params.groupId;


 

    return (
        <div className="h-full">
            <GroupChatRoom groupId={groupId} groupName={groupId} />
        </div>
    );
}
