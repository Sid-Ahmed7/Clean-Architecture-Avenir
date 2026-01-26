import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../server/.env') });

// Create database pool
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
});

// Password hashing configuration
const SALT_ROUNDS = 10;
const TEST_PASSWORD = 'Password123!'; // Clear password for all test users

interface TestUser {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
}

async function loadMessagingFixtures() {
    console.log('🚀 Starting to load messaging fixtures...\n');

    try {
        // ============================================
        // 1. CLEAN EXISTING MESSAGING DATA
        // ============================================
        console.log('🧹 Cleaning existing messaging data...');
        
        await pool.query('DELETE FROM group_messages');
        await pool.query('DELETE FROM group_participants');
        await pool.query('DELETE FROM group_conversations');
        await pool.query('DELETE FROM messages');
        await pool.query('DELETE FROM conversations');
        
        console.log('✅ Existing messaging data cleaned\n');

        // ============================================
        // 2. CREATE TEST USERS
        // ============================================
        console.log('👥 Creating test users...');
        
        // Hash the test password once
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, SALT_ROUNDS);
        console.log(`  ℹ️  Test password: "${TEST_PASSWORD}" (will be hashed with bcrypt)\n`);
        
        const testUsers: TestUser[] = [
            // Clients
            {
                id: 'client-001',
                email: 'client1@test.com',
                password: hashedPassword,
                firstName: 'Marie',
                lastName: 'Dupont',
                role: 'CLIENT'
            },
            {
                id: 'client-002',
                email: 'client2@test.com',
                password: hashedPassword,
                firstName: 'Pierre',
                lastName: 'Martin',
                role: 'CLIENT'
            },
            // Advisors
            {
                id: 'advisor-001',
                email: 'advisor1@test.com',
                password: hashedPassword,
                firstName: 'Sophie',
                lastName: 'Bernard',
                role: 'BANK_ADVISOR'
            },
            {
                id: 'advisor-002',
                email: 'advisor2@test.com',
                password: hashedPassword,
                firstName: 'Lucas',
                lastName: 'Petit',
                role: 'BANK_ADVISOR'
            },
            // Manager
            {
                id: 'manager-001',
                email: 'manager1@test.com',
                password: hashedPassword,
                firstName: 'Jean',
                lastName: 'Dubois',
                role: 'BANK_MANAGER'
            }
        ];

        // Insert users if they don't exist
        for (const user of testUsers) {
            const existingUser = await pool.query(
                'SELECT id FROM bank_users WHERE id = $1',
                [user.id]
            );

            if (existingUser.rows.length === 0) {
                await pool.query(
                    `INSERT INTO bank_users (id, email, password, status, first_name, last_name, phone_number, date_of_birth, address, is_registered)
                     VALUES ($1, $2, $3, 'ACTIVE', $4, $5, '+33612345678', '1990-01-01', '123 Rue de Test, Paris', true)`,
                    [user.id, user.email, user.password, user.firstName, user.lastName]
                );
                console.log(`  ✓ Created user: ${user.firstName} ${user.lastName} (${user.role})`);
            } else {
                console.log(`  ⊙ User already exists: ${user.firstName} ${user.lastName}`);
            }

            // Assign role
            // First, get the role_id from the roles table
            const roleResult = await pool.query(
                'SELECT id FROM roles WHERE name = $1',
                [user.role]
            );

            if (roleResult.rows.length > 0) {
                const roleId = roleResult.rows[0].id;
                const roleExists = await pool.query(
                    'SELECT * FROM user_roles WHERE user_id = $1 AND role_id = $2',
                    [user.id, roleId]
                );

                if (roleExists.rows.length === 0) {
                    await pool.query(
                        'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
                        [user.id, roleId]
                    );
                }
            }
        }

        console.log('✅ Test users created\n');

        // ============================================
        // 3. CREATE INDIVIDUAL CONVERSATIONS
        // ============================================
        console.log('💬 Creating individual conversations...');

        const conversations = [
            {
                id: 'conv-001',
                clientId: 'client-001',
                advisorId: 'advisor-001',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
            },
            {
                id: 'conv-002',
                clientId: 'client-002',
                advisorId: 'advisor-001',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            },
            {
                id: 'conv-003',
                clientId: 'client-001',
                advisorId: 'advisor-002',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
            }
        ];

        for (const conv of conversations) {
            await pool.query(
                'INSERT INTO conversations (id, client_id, advisor_id, created_at) VALUES ($1, $2, $3, $4)',
                [conv.id, conv.clientId, conv.advisorId, conv.createdAt]
            );
            console.log(`  ✓ Created conversation: ${conv.id}`);
        }

        console.log('✅ Individual conversations created\n');

        // ============================================
        // 4. CREATE MESSAGES FOR CONVERSATIONS
        // ============================================
        console.log('📨 Creating messages for conversations...');

        const messages = [
            // Conversation 1 (conv-001)
            {
                id: 'msg-001',
                conversationId: 'conv-001',
                clientId: 'client-001',
                advisorId: 'advisor-001',
                authorId: 'client-001',
                content: 'Bonjour, j\'aimerais avoir des informations sur les comptes épargne.',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'msg-002',
                conversationId: 'conv-001',
                clientId: 'client-001',
                advisorId: 'advisor-001',
                authorId: 'advisor-001',
                content: 'Bonjour Marie ! Bien sûr, je serais ravie de vous aider. Nous proposons plusieurs types de comptes épargne.',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000)
            },
            {
                id: 'msg-003',
                conversationId: 'conv-001',
                clientId: 'client-001',
                advisorId: 'advisor-001',
                authorId: 'client-001',
                content: 'Quels sont les taux d\'intérêt actuels ?',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000)
            },
            {
                id: 'msg-004',
                conversationId: 'conv-001',
                clientId: 'client-001',
                advisorId: 'advisor-001',
                authorId: 'advisor-001',
                content: 'Les taux varient entre 2% et 4% selon le type de compte et la durée d\'engagement.',
                readStatus: 'UNREAD',
                sentAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
            },

            // Conversation 2 (conv-002)
            {
                id: 'msg-005',
                conversationId: 'conv-002',
                clientId: 'client-002',
                advisorId: 'advisor-001',
                authorId: 'client-002',
                content: 'Bonjour, j\'ai un problème avec ma carte bancaire.',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'msg-006',
                conversationId: 'conv-002',
                clientId: 'client-002',
                advisorId: 'advisor-001',
                authorId: 'advisor-001',
                content: 'Bonjour Pierre, je suis désolée d\'apprendre cela. Pouvez-vous me donner plus de détails ?',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000)
            },
            {
                id: 'msg-007',
                conversationId: 'conv-002',
                clientId: 'client-002',
                advisorId: 'advisor-001',
                authorId: 'client-002',
                content: 'Ma carte a été refusée ce matin alors que j\'ai des fonds suffisants.',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000)
            },
            {
                id: 'msg-008',
                conversationId: 'conv-002',
                clientId: 'client-002',
                advisorId: 'advisor-001',
                authorId: 'advisor-001',
                content: 'Je vais vérifier cela immédiatement. Il se peut que votre carte ait été temporairement bloquée pour des raisons de sécurité.',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'msg-009',
                conversationId: 'conv-002',
                clientId: 'client-002',
                advisorId: 'advisor-001',
                authorId: 'advisor-001',
                content: 'Tout est résolu ! Votre carte est de nouveau active.',
                readStatus: 'UNREAD',
                sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },

            // Conversation 3 (conv-003)
            {
                id: 'msg-010',
                conversationId: 'conv-003',
                clientId: 'client-001',
                advisorId: 'advisor-002',
                authorId: 'client-001',
                content: 'Bonjour, je souhaite faire un virement international.',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'msg-011',
                conversationId: 'conv-003',
                clientId: 'client-001',
                advisorId: 'advisor-002',
                authorId: 'advisor-002',
                content: 'Bonjour Marie ! Pas de problème. Vers quel pays souhaitez-vous effectuer ce virement ?',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000)
            },
            {
                id: 'msg-012',
                conversationId: 'conv-003',
                clientId: 'client-001',
                advisorId: 'advisor-002',
                authorId: 'client-001',
                content: 'Vers l\'Espagne, pour un montant de 5000€.',
                readStatus: 'UNREAD',
                sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
            }
        ];

        for (const msg of messages) {
            await pool.query(
                `INSERT INTO messages (id, conversation_id, conversation_client_id, conversation_advisor_id, author_id, content, read_status, sent_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [msg.id, msg.conversationId, msg.clientId, msg.advisorId, msg.authorId, msg.content, msg.readStatus, msg.sentAt]
            );
        }

        console.log(`  ✓ Created ${messages.length} messages`);
        console.log('✅ Messages created\n');

        // ============================================
        // 5. CREATE GROUP CONVERSATIONS
        // ============================================
        console.log('👥 Creating group conversations...');

        const groupConversations = [
            {
                id: randomUUID(),
                name: 'Équipe Commerciale',
                createdBy: 'manager-001',
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
            },
            {
                id: randomUUID(),
                name: 'Support Client',
                createdBy: 'manager-001',
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
            }
        ];

        for (const group of groupConversations) {
            await pool.query(
                'INSERT INTO group_conversations (id, name, created_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)',
                [group.id, group.name, group.createdBy, group.createdAt, group.createdAt]
            );
            console.log(`  ✓ Created group: ${group.name}`);
        }

        console.log('✅ Group conversations created\n');

        // ============================================
        // 6. ADD GROUP PARTICIPANTS
        // ============================================
        console.log('👤 Adding group participants...');

        const groupParticipants = [
            // Group 1 participants
            { groupId: groupConversations[0].id, userId: 'manager-001', role: 'BANK_MANAGER' },
            { groupId: groupConversations[0].id, userId: 'advisor-001', role: 'BANK_ADVISOR' },
            { groupId: groupConversations[0].id, userId: 'advisor-002', role: 'BANK_ADVISOR' },
            
            // Group 2 participants
            { groupId: groupConversations[1].id, userId: 'manager-001', role: 'BANK_MANAGER' },
            { groupId: groupConversations[1].id, userId: 'advisor-001', role: 'BANK_ADVISOR' }
        ];

        for (const participant of groupParticipants) {
            await pool.query(
                'INSERT INTO group_participants (id, group_id, user_id, role, joined_at) VALUES ($1, $2, $3, $4, NOW())',
                [randomUUID(), participant.groupId, participant.userId, participant.role]
            );
        }

        console.log(`  ✓ Added ${groupParticipants.length} participants`);
        console.log('✅ Group participants added\n');

        // ============================================
        // 7. CREATE GROUP MESSAGES
        // ============================================
        console.log('💬 Creating group messages...');

        const groupMessages = [
            // Group 1 messages
            {
                groupId: groupConversations[0].id,
                senderId: 'manager-001',
                senderRole: 'BANK_MANAGER',
                senderFirstName: 'Jean',
                senderLastName: 'Dubois',
                content: 'Bonjour à tous ! Bienvenue dans le groupe Équipe Commerciale.',
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                readBy: ['manager-001', 'advisor-001', 'advisor-002']
            },
            {
                groupId: groupConversations[0].id,
                senderId: 'advisor-001',
                senderRole: 'BANK_ADVISOR',
                senderFirstName: 'Sophie',
                senderLastName: 'Bernard',
                content: 'Merci Jean ! Hâte de collaborer avec vous tous.',
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
                readBy: ['manager-001', 'advisor-001', 'advisor-002']
            },
            {
                groupId: groupConversations[0].id,
                senderId: 'advisor-002',
                senderRole: 'BANK_ADVISOR',
                senderFirstName: 'Lucas',
                senderLastName: 'Petit',
                content: 'Bonjour à tous ! Ravi de faire partie de l\'équipe.',
                createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
                readBy: ['manager-001', 'advisor-001']
            },
            {
                groupId: groupConversations[0].id,
                senderId: 'manager-001',
                senderRole: 'BANK_MANAGER',
                senderFirstName: 'Jean',
                senderLastName: 'Dubois',
                content: 'Nous avons une réunion prévue demain à 10h pour discuter des objectifs du trimestre.',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                readBy: ['manager-001']
            },

            // Group 2 messages
            {
                groupId: groupConversations[1].id,
                senderId: 'manager-001',
                senderRole: 'BANK_MANAGER',
                senderFirstName: 'Jean',
                senderLastName: 'Dubois',
                content: 'Groupe Support Client créé pour faciliter la communication.',
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                readBy: ['manager-001', 'advisor-001']
            },
            {
                groupId: groupConversations[1].id,
                senderId: 'advisor-001',
                senderRole: 'BANK_ADVISOR',
                senderFirstName: 'Sophie',
                senderLastName: 'Bernard',
                content: 'Parfait ! J\'ai plusieurs questions de clients à partager.',
                createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
                readBy: ['manager-001', 'advisor-001']
            },
            {
                groupId: groupConversations[1].id,
                senderId: 'advisor-001',
                senderRole: 'BANK_ADVISOR',
                senderFirstName: 'Sophie',
                senderLastName: 'Bernard',
                content: 'Un client demande des informations sur les prêts immobiliers. Quelqu\'un peut m\'aider ?',
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
                readBy: ['advisor-001']
            }
        ];

        for (const msg of groupMessages) {
            await pool.query(
                `INSERT INTO group_messages (id, group_id, sender_id, sender_role, sender_first_name, sender_last_name, content, created_at, read_by)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [randomUUID(), msg.groupId, msg.senderId, msg.senderRole, msg.senderFirstName, msg.senderLastName, msg.content, msg.createdAt, msg.readBy]
            );
        }

        console.log(`  ✓ Created ${groupMessages.length} group messages`);
        console.log('✅ Group messages created\n');

        // ============================================
        // SUMMARY
        // ============================================
        console.log('📊 SUMMARY:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✓ ${testUsers.length} test users`);
        console.log(`✓ ${conversations.length} individual conversations`);
        console.log(`✓ ${messages.length} individual messages`);
        console.log(`✓ ${groupConversations.length} group conversations`);
        console.log(`✓ ${groupParticipants.length} group participants`);
        console.log(`✓ ${groupMessages.length} group messages`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('🎉 Messaging fixtures loaded successfully!\n');

    } catch (error) {
        console.error('❌ Error loading messaging fixtures:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Run the fixtures
loadMessagingFixtures()
    .then(() => {
        console.log('✅ Process completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Process failed:', error);
        process.exit(1);
    });
