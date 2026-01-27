import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../server/.env') });

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
});

const SALT_ROUNDS = 10;
const TEST_PASSWORD = 'Password123!';

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

        // User IDs
        const clientId1 = randomUUID();
        const clientId2 = randomUUID();
        const advisorId1 = randomUUID();
        const advisorId2 = randomUUID();
        const managerId1 = randomUUID();

        // Conversation IDs
        const convId1 = randomUUID();
        const convId2 = randomUUID();
        const convId3 = randomUUID();

        // Message IDs
        const msgId1 = randomUUID();
        const msgId2 = randomUUID();
        const msgId3 = randomUUID();
        const msgId4 = randomUUID();
        const msgId5 = randomUUID();
        const msgId6 = randomUUID();
        const msgId7 = randomUUID();
        const msgId8 = randomUUID();
        const msgId9 = randomUUID();
        const msgId10 = randomUUID();
        const msgId11 = randomUUID();
        const msgId12 = randomUUID();

        // Group conversation IDs
        const groupId1 = randomUUID();
        const groupId2 = randomUUID();

        console.log('📋 Generated UUIDs:');
        console.log(`  Client 1: ${clientId1}`);
        console.log(`  Client 2: ${clientId2}`);
        console.log(`  Advisor 1: ${advisorId1}`);
        console.log(`  Advisor 2: ${advisorId2}`);
        console.log(`  Manager 1: ${managerId1}\n`);

        console.log('🧹 Cleaning existing messaging data...');

        await pool.query('DELETE FROM group_messages');
        await pool.query('DELETE FROM group_participants');
        await pool.query('DELETE FROM group_conversations');
        await pool.query('DELETE FROM messages');
        await pool.query('DELETE FROM conversations');

        console.log('✅ Existing messaging data cleaned\n');


        console.log('👥 Creating test users...');

        // Hash the test password once
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, SALT_ROUNDS);
        console.log(`  ℹ️  Test password: "${TEST_PASSWORD}" (will be hashed with bcrypt)\n`);

        const testUsers: TestUser[] = [
            // Clients
            {
                id: clientId1,
                email: 'client1@test.com',
                password: hashedPassword,
                firstName: 'Marie',
                lastName: 'Dupont',
                role: 'CLIENT'
            },
            {
                id: clientId2,
                email: 'client2@test.com',
                password: hashedPassword,
                firstName: 'Pierre',
                lastName: 'Martin',
                role: 'CLIENT'
            },
            // Advisors
            {
                id: advisorId1,
                email: 'advisor1@test.com',
                password: hashedPassword,
                firstName: 'Sophie',
                lastName: 'Bernard',
                role: 'BANK_ADVISOR'
            },
            {
                id: advisorId2,
                email: 'advisor2@test.com',
                password: hashedPassword,
                firstName: 'Lucas',
                lastName: 'Petit',
                role: 'BANK_ADVISOR'
            },
            // Manager
            {
                id: managerId1,
                email: 'manager1@test.com',
                password: hashedPassword,
                firstName: 'Jean',
                lastName: 'Dubois',
                role: 'BANK_MANAGER'
            }
        ];

        const userIdMap: Record<string, string> = {};

        for (const user of testUsers) {
            const existingUser = await pool.query(
                'SELECT id FROM bank_users WHERE email = $1',
                [user.email]
            );

            let actualUserId: string;

            if (existingUser.rows.length === 0) {
                await pool.query(
                    `INSERT INTO bank_users (id, email, password, status, first_name, last_name, phone_number, date_of_birth, address, is_registered)
                     VALUES ($1, $2, $3, 'ACTIVE', $4, $5, '+33612345678', '1990-01-01', '123 Rue de Test, Paris', true)`,
                    [user.id, user.email, user.password, user.firstName, user.lastName]
                );
                actualUserId = user.id;
                console.log(`  ✓ Created user: ${user.firstName} ${user.lastName} (${user.role}) - ID: ${actualUserId}`);
            } else {
                actualUserId = existingUser.rows[0].id;
                console.log(`  ⊙ User already exists: ${user.firstName} ${user.lastName} - ID: ${actualUserId}`);
            }

            userIdMap[user.email] = actualUserId;

            const roleResult = await pool.query(
                'SELECT id FROM roles WHERE name = $1',
                [user.role]
            );

            if (roleResult.rows.length > 0) {
                const roleId = roleResult.rows[0].id;
                const roleExists = await pool.query(
                    'SELECT * FROM user_roles WHERE user_id = $1 AND role_id = $2',
                    [actualUserId, roleId]
                );

                if (roleExists.rows.length === 0) {
                    await pool.query(
                        'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
                        [actualUserId, roleId]
                    );
                }
            }
        }

        const actualClientId1 = userIdMap['client1@test.com'] || clientId1;
        const actualClientId2 = userIdMap['client2@test.com'] || clientId2;
        const actualAdvisorId1 = userIdMap['advisor1@test.com'] || advisorId1;
        const actualAdvisorId2 = userIdMap['advisor2@test.com'] || advisorId2;
        const actualManagerId1 = userIdMap['manager1@test.com'] || managerId1;

        console.log('✅ Test users created\n');


        console.log('🏦 Creating bank accounts for clients...');

        const accountNumber1 = Math.floor(10000000 + Math.random() * 90000000);
        const accountNumber2 = Math.floor(10000000 + Math.random() * 90000000);

        const generateFrenchIban = (accountNum: number) => {
            const bankCode = '30001';
            const branchCode = '00001';
            const accountStr = accountNum.toString().padStart(11, '0');
            const key = '97';
            return `FR76${bankCode}${branchCode}${accountStr}${key}`;
        };

        const accounts = [
            {
                accountNumber: accountNumber1,
                iban: generateFrenchIban(accountNumber1),
                userId: actualClientId1,
                accountType: 'CHECKING',
                currency: 'EUR',
                accountStatus: 'ACTIVE',
                isActive: true,
                currentBalance: 5250.75,
                withdrawalLimit: 3000,
                transferLimit: 3000,
                overdraftLimit: 1000,
                customAccountName: 'Compte Courant Marie',
                totalTransfered: 0,
                createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) 
            },
            {
                accountNumber: accountNumber2,
                iban: generateFrenchIban(accountNumber2),
                userId: actualClientId2,
                accountType: 'CHECKING',
                currency: 'EUR',
                accountStatus: 'ACTIVE',
                isActive: true,
                currentBalance: 12340.50,
                withdrawalLimit: 3000,
                transferLimit: 3000,
                overdraftLimit: 500,
                customAccountName: 'Compte Courant Pierre',
                totalTransfered: 0,
                createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) // 6 months ago
            }
        ];

        for (const account of accounts) {
            const existingAccount = await pool.query(
                'SELECT account_number FROM accounts WHERE user_id = $1 AND account_type = $2',
                [account.userId, account.accountType]
            );

            if (existingAccount.rows.length === 0) {
                await pool.query(
                    `INSERT INTO accounts (
                        account_number, iban, user_id, account_type, currency, account_status,
                        is_active, current_balance, withdrawal_limit, transfer_limit, overdraft_limit,
                        custom_account_name, total_transfered, last_transfer_reset_date, created_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
                    [
                        account.accountNumber, account.iban, account.userId, account.accountType,
                        account.currency, account.accountStatus, account.isActive, account.currentBalance,
                        account.withdrawalLimit, account.transferLimit, account.overdraftLimit,
                        account.customAccountName, account.totalTransfered, new Date(), account.createdAt
                    ]
                );
                console.log(`  ✓ Created account: ${account.customAccountName} - IBAN: ${account.iban} - Balance: ${account.currentBalance}€`);
            } else {
                console.log(`  ⊙ Account already exists for user: ${account.userId}`);
            }
        }

        console.log('✅ Bank accounts created\n');

        console.log('💬 Creating individual conversations...');

        const conversations = [
            {
                id: convId1,
                clientId: actualClientId1,
                advisorId: actualAdvisorId1,
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
            },
            {
                id: convId2,
                clientId: actualClientId2,
                advisorId: actualAdvisorId1,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) 
            },
            {
                id: convId3,
                clientId: actualClientId1,
                advisorId: actualAdvisorId2,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) 
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


        console.log('📨 Creating messages for conversations...');

        const messages = [
            {
                id: msgId1,
                conversationId: convId1,
                clientId: actualClientId1,
                advisorId: actualAdvisorId1,
                authorId: actualClientId1,
                content: 'Bonjour, j\'aimerais avoir des informations sur les comptes épargne.',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            },
            {
                id: msgId2,
                conversationId: convId1,
                clientId: actualClientId1,
                advisorId: actualAdvisorId1,
                authorId: actualAdvisorId1,
                content: 'Bonjour Marie ! Bien sûr, je serais ravie de vous aider. Nous proposons plusieurs types de comptes épargne.',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000)
            },
            {
                id: msgId3,
                conversationId: convId1,
                clientId: actualClientId1,
                advisorId: actualAdvisorId1,
                authorId: actualClientId1,
                content: 'Quels sont les taux d\'intérêt actuels ?',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000)
            },
            {
                id: msgId4,
                conversationId: convId1,
                clientId: actualClientId1,
                advisorId: actualAdvisorId1,
                authorId: actualAdvisorId1,
                content: 'Les taux varient entre 2% et 4% selon le type de compte et la durée d\'engagement.',
                readStatus: 'UNREAD',
                sentAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
            },

            {
                id: msgId5,
                conversationId: convId2,
                clientId: actualClientId2,
                advisorId: actualAdvisorId1,
                authorId: actualClientId2,
                content: 'Bonjour, j\'ai un problème avec ma carte bancaire.',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: msgId6,
                conversationId: convId2,
                clientId: actualClientId2,
                advisorId: actualAdvisorId1,
                authorId: actualAdvisorId1,
                content: 'Bonjour Pierre, je suis désolée d\'apprendre cela. Pouvez-vous me donner plus de détails ?',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000)
            },
            {
                id: msgId7,
                conversationId: convId2,
                clientId: actualClientId2,
                advisorId: actualAdvisorId1,
                authorId: actualClientId2,
                content: 'Ma carte a été refusée ce matin alors que j\'ai des fonds suffisants.',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000)
            },
            {
                id: msgId8,
                conversationId: convId2,
                clientId: actualClientId2,
                advisorId: actualAdvisorId1,
                authorId: actualAdvisorId1,
                content: 'Je vais vérifier cela immédiatement. Il se peut que votre carte ait été temporairement bloquée pour des raisons de sécurité.',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                id: msgId9,
                conversationId: convId2,
                clientId: actualClientId2,
                advisorId: actualAdvisorId1,
                authorId: actualAdvisorId1,
                content: 'Tout est résolu ! Votre carte est de nouveau active.',
                readStatus: 'UNREAD',
                sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },

            {
                id: msgId10,
                conversationId: convId3,
                clientId: actualClientId1,
                advisorId: actualAdvisorId2,
                authorId: actualClientId1,
                content: 'Bonjour, je souhaite faire un virement international.',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                id: msgId11,
                conversationId: convId3,
                clientId: actualClientId1,
                advisorId: actualAdvisorId2,
                authorId: actualAdvisorId2,
                content: 'Bonjour Marie ! Pas de problème. Vers quel pays souhaitez-vous effectuer ce virement ?',
                readStatus: 'READ',
                sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000)
            },
            {
                id: msgId12,
                conversationId: convId3,
                clientId: actualClientId1,
                advisorId: actualAdvisorId2,
                authorId: actualClientId1,
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


        console.log('👥 Creating group conversations...');

        const groupConversations = [
            {
                id: groupId1,
                name: 'Équipe Commerciale',
                createdBy: actualManagerId1,
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) 
            },
            {
                id: groupId2,
                name: 'Support Client',
                createdBy: actualManagerId1,
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) 
            }
        ];

        for (const group of groupConversations) {
            await pool.query(
                'INSERT INTO group_conversations (id, name, created_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)',
                [group.id, group.name, group.createdBy, group.createdAt, group.createdAt]
            );
            console.log(`  ✓ Created group: ${group.name} - ID: ${group.id}`);
        }

        console.log('✅ Group conversations created\n');


        console.log('👤 Adding group participants...');

        const groupParticipants = [
            // Group 1 participants (Équipe Commerciale)
            { groupId: groupId1, userId: actualManagerId1, role: 'BANK_MANAGER' },
            { groupId: groupId1, userId: actualAdvisorId1, role: 'BANK_ADVISOR' },
            { groupId: groupId1, userId: actualAdvisorId2, role: 'BANK_ADVISOR' },

            // Group 2 participants (Support Client)
            { groupId: groupId2, userId: actualManagerId1, role: 'BANK_MANAGER' },
            { groupId: groupId2, userId: actualAdvisorId1, role: 'BANK_ADVISOR' }
        ];

        for (const participant of groupParticipants) {
            await pool.query(
                'INSERT INTO group_participants (id, group_id, user_id, role, joined_at) VALUES ($1, $2, $3, $4, NOW())',
                [randomUUID(), participant.groupId, participant.userId, participant.role]
            );
        }

        console.log(`  ✓ Added ${groupParticipants.length} participants`);
        console.log('✅ Group participants added\n');

        console.log('💬 Creating group messages...');

        const groupMessages = [
            // Group 1 messages (Équipe Commerciale)
            {
                groupId: groupId1,
                senderId: actualManagerId1,
                senderRole: 'BANK_MANAGER',
                senderFirstName: 'Jean',
                senderLastName: 'Dubois',
                content: 'Bonjour à tous ! Bienvenue dans le groupe Équipe Commerciale.',
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                readBy: [actualManagerId1, actualAdvisorId1, actualAdvisorId2]
            },
            {
                groupId: groupId1,
                senderId: actualAdvisorId1,
                senderRole: 'BANK_ADVISOR',
                senderFirstName: 'Sophie',
                senderLastName: 'Bernard',
                content: 'Merci Jean ! Hâte de collaborer avec vous tous.',
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
                readBy: [actualManagerId1, actualAdvisorId1, actualAdvisorId2]
            },
            {
                groupId: groupId1,
                senderId: actualAdvisorId2,
                senderRole: 'BANK_ADVISOR',
                senderFirstName: 'Lucas',
                senderLastName: 'Petit',
                content: 'Bonjour à tous ! Ravi de faire partie de l\'équipe.',
                createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
                readBy: [actualManagerId1, actualAdvisorId1]
            },
            {
                groupId: groupId1,
                senderId: actualManagerId1,
                senderRole: 'BANK_MANAGER',
                senderFirstName: 'Jean',
                senderLastName: 'Dubois',
                content: 'Nous avons une réunion prévue demain à 10h pour discuter des objectifs du trimestre.',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                readBy: [actualManagerId1]
            },

            // Group 2 messages (Support Client)
            {
                groupId: groupId2,
                senderId: actualManagerId1,
                senderRole: 'BANK_MANAGER',
                senderFirstName: 'Jean',
                senderLastName: 'Dubois',
                content: 'Groupe Support Client créé pour faciliter la communication.',
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                readBy: [actualManagerId1, actualAdvisorId1]
            },
            {
                groupId: groupId2,
                senderId: actualAdvisorId1,
                senderRole: 'BANK_ADVISOR',
                senderFirstName: 'Sophie',
                senderLastName: 'Bernard',
                content: 'Parfait ! J\'ai plusieurs questions de clients à partager.',
                createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
                readBy: [actualManagerId1, actualAdvisorId1]
            },
            {
                groupId: groupId2,
                senderId: actualAdvisorId1,
                senderRole: 'BANK_ADVISOR',
                senderFirstName: 'Sophie',
                senderLastName: 'Bernard',
                content: 'Un client demande des informations sur les prêts immobiliers. Quelqu\'un peut m\'aider ?',
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
                readBy: [actualAdvisorId1]
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


        console.log('📊 SUMMARY:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✓ ${testUsers.length} test users`);
        console.log(`✓ ${accounts.length} bank accounts (CHECKING)`);
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

loadMessagingFixtures()
    .then(() => {
        console.log('✅ Process completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Process failed:', error);
        process.exit(1);
    });
