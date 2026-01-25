import { getAllGroups, createGroupConversation, joinGroupConversation } from './../lib/api/groupChat';
import { useState, useEffect } from 'react';
import { GroupConversation } from '@/types/groupConversation';

export function useGroupChatList() {


  const [groups, setGroups] = useState<GroupConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchAllGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllGroups();
      setGroups(data);
    } catch (err) {
      setError("Failed to fetch group chats.");
    } finally {
      setLoading(false);
    }   
    };
    useEffect(() => {
        fetchAllGroups();
    }, []);

    const createGroup = async (name: string) => {
        setCreating(true);
        setError(null);
        try {
            const newGroup = await createGroupConversation(name);
            setGroups((prevGroups) => [...prevGroups, newGroup]);
        } catch (err) {
            setError("Failed to create group chat.");
        } finally {
            setCreating(false);
        }
    };

    const joinAGroup = async (groupId: string) => {
        setLoading(true);
        setError(null);
        try {
            await joinGroupConversation(groupId);
        }
        catch (err) {
            setError("Failed to join the group chat.");
        }
        finally {
            setLoading(false);
        }
    };

    return {
        groups,
        loading,
        error,
        creating,
        createGroup,
        joinAGroup,
        refetch: fetchAllGroups,
    };
}