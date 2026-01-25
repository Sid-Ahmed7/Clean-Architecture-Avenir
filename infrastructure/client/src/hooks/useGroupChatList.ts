import { getAllGroups, createGroupConversation, joinGroupConversation, getAllUnreadCounts } from './../lib/api/groupChat';
import { useState, useEffect, useCallback } from 'react';
import { GroupConversation } from '@/types/groupConversation';

export function useGroupChatList() {


  const [groups, setGroups] = useState<GroupConversation[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchAllGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllGroups();
      const [groupsData, unreadData] = await Promise.all([
                getAllGroups(),
                getAllUnreadCounts()
            ]);
            setGroups(groupsData);
            setUnreadCounts(unreadData);    } catch (err) {
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
    
    const getUnreadCount = useCallback((groupId: string): number => {
        return unreadCounts[groupId] || 0;
    }, [unreadCounts]);

    const updateUnreadCount = useCallback((groupId: string, count: number) => {
        setUnreadCounts(prev => ({
            ...prev,
            [groupId]: count
        }));
    }, []);

    return {
        groups,
        loading,
        error,
        creating,
        createGroup,
        joinAGroup,
        refetch: fetchAllGroups,
        getUnreadCount,
        updateUnreadCount
    };
}