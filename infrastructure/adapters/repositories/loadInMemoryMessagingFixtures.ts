import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import {
    userRepository,
    roleRepository,
    userRoleRepository,
    accountRepository,
    conversationRepository,
    messageRepository,
    groupConversationRepository,
    groupParticipantRepository,
    groupMessageRepository
} from '../config/repositories.js';

import { BankUserEntity } from '../../../domain/entities/BankUserEntity.js';
import { UserStatusEnum } from '../../../domain/enums/UserStatusEnum.js';
import { RoleEnum } from '../../../domain/enums/RoleEnum.js';
import { ConversationEntity } from '../../../domain/entities/ConversationEntity.js';
import { MessageEntity } from '../../../domain/entities/MessageEntity.js';
import { ReadStatusEnum } from '../../../domain/enums/ReadStatusEnum.js';
import { GroupConversationEntity } from '../../../domain/entities/GroupConversationEntity.js';
import { GroupParticipantEntity } from '../../../domain/entities/GroupParticipantEntity.js';
import { GroupMessageEntity } from '../../../domain/entities/GroupMessageEntity.js';
import { AccountEntity } from '../../../domain/entities/AccountEntity.js';
import { AccountTypeEnum } from '../../../domain/enums/AccountTypeEnum.js';
import { AccountStatusEnum } from '../../../domain/enums/AccountStatusEnum.js';

const SALT_ROUNDS = 10;
const TEST_PASSWORD = 'Password123!';

interface TestUser {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: RoleEnum;
}

export async function loadInMemoryMessagingFixtures() {
    console.log('Starting to load in-memory messaging fixtures...\n');

    try {

        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, SALT_ROUNDS);
        console.log(`  ℹ️  Test password: "${TEST_PASSWORD}" (hashed with bcrypt)\n`);


        console.log('👥 Creating test users...');

        const testUsers: TestUser[] = [
            // Clients
            {
                id: 'client-001',
                email: 'client1@test.com',
                password: hashedPassword,
                firstName: 'Marie',
                lastName: 'Dupont',
                role: RoleEnum.CLIENT
            },
            {
                id: 'client-002',
                email: 'client2@test.com',
                password: hashedPassword,
                firstName: 'Pierre',
                lastName: 'Martin',
                role: RoleEnum.CLIENT
            },
            // Advisors
            {
                id: 'advisor-001',
                email: 'advisor1@test.com',
                password: hashedPassword,
                firstName: 'Sophie',
                lastName: 'Bernard',
                role: RoleEnum.BANK_ADVISOR
            },
            {
                id: 'advisor-002',
                email: 'advisor2@test.com',
                password: hashedPassword,
                firstName: 'Lucas',
                lastName: 'Petit',
                role: RoleEnum.BANK_ADVISOR
            },
            // Manager
            {
                id: 'manager-001',
                email: 'manager1@test.com',
                password: hashedPassword,
                firstName: 'Jean',
                lastName: 'Dubois',
                role: RoleEnum.BANK_MANAGER
            }
        ];

        // Create users
        for (const user of testUsers) {
            const userEntity = BankUserEntity.from(
                user.id,
                user.email,
                user.password,
                UserStatusEnum.ACTIVE,
                user.firstName,
                user.lastName,
                '+33612345678',
                new Date('1990-01-01'),
                '123 Rue de Test, Paris',
                true,
                undefined,
                undefined,
                undefined,
                undefined,
                new Date()
            );

            if (userEntity instanceof Error) {
                console.error(`  ❌ Error creating user ${user.email}:`, userEntity.message);
                continue;
            }

            const result = await userRepository.createUser(userEntity);
            if (result instanceof Error) {
                console.log(`  ⊙ User already exists: ${user.firstName} ${user.lastName}`);
            } else {
                console.log(`  ✓ Created user: ${user.firstName} ${user.lastName} (${user.role})`);
            }

            const roleResult = await roleRepository.findByName(user.role);
            if (!(roleResult instanceof Error)) {
                await userRoleRepository.addRoleToUser(user.id, roleResult.id);
            }
        }

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
                userId: 'client-001',
                accountType: AccountTypeEnum.CHECKING,
                currency: 'EUR',
                accountStatus: AccountStatusEnum.ACTIVE,
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
                userId: 'client-002',
                accountType: AccountTypeEnum.CHECKING,
                currency: 'EUR',
                accountStatus: AccountStatusEnum.ACTIVE,
                isActive: true,
                currentBalance: 12340.50,
                withdrawalLimit: 3000,
                transferLimit: 3000,
                overdraftLimit: 500,
                customAccountName: 'Compte Courant Pierre',
                totalTransfered: 0,
                createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) 
            }
        ];

        for (const account of accounts) {
            const accountEntity = AccountEntity.from(
                account.accountNumber,
                account.iban,
                account.userId,
                account.accountType,
                account.currency,
                account.accountStatus,
                account.isActive,
                account.currentBalance,
                account.createdAt,
                account.withdrawalLimit,
                account.transferLimit,
                account.overdraftLimit,
                account.customAccountName,
                account.totalTransfered,
                new Date()
            );

            if (accountEntity instanceof Error) {
                console.error(`  ❌ Error creating account for ${account.userId}:`, accountEntity.message);
                continue;
            }

            const result = await accountRepository.createOneAccount(accountEntity);
            if (result instanceof Error) {
                console.log(`  ⊙ Account already exists for: ${account.userId}`);
            } else {
                console.log(`  ✓ Created account: ${account.customAccountName} - IBAN: ${account.iban} - Balance: ${account.currentBalance}€`);
            }
        }

        console.log('✅ Bank accounts created\n');


        console.log('💬 Creating individual conversations...');

        const conversations = [
            {
                id: 'conv-001',
                clientId: 'client-001',
                advisorId: 'advisor-001',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'conv-002',
                clientId: 'client-002',
                advisorId: 'advisor-001',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'conv-003',
                clientId: 'client-001',
                advisorId: 'advisor-002',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            }
        ];

        for (const conv of conversations) {
            const conversationEntity = ConversationEntity.from(
                conv.id,
                conv.clientId,
                conv.advisorId,
                conv.createdAt
            );

            if (!(conversationEntity instanceof Error)) {
                await conversationRepository.save(conversationEntity);
                console.log(`  ✓ Created conversation: ${conv.id}`);
            }
        }

        console.log('✅ Individual conversations created\n');


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
                readStatus: ReadStatusEnum.READ,
                sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'msg-002',
                conversationId: 'conv-001',
                clientId: 'client-001',
                advisorId: 'advisor-001',
                authorId: 'advisor-001',
                content: 'Bonjour Marie ! Bien sûr, je serais ravie de vous aider. Nous proposons plusieurs types de comptes épargne.',
                readStatus: ReadStatusEnum.READ,
                sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000)
            },
            {
                id: 'msg-003',
                conversationId: 'conv-001',
                clientId: 'client-001',
                advisorId: 'advisor-001',
                authorId: 'client-001',
                content: 'Quels sont les taux d\'intérêt actuels ?',
                readStatus: ReadStatusEnum.READ,
                sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000)
            },
            {
                id: 'msg-004',
                conversationId: 'conv-001',
                clientId: 'client-001',
                advisorId: 'advisor-001',
                authorId: 'advisor-001',
                content: 'Les taux varient entre 2% et 4% selon le type de compte et la durée d\'engagement.',
                readStatus: ReadStatusEnum.UNREAD,
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
                readStatus: ReadStatusEnum.READ,
                sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'msg-006',
                conversationId: 'conv-002',
                clientId: 'client-002',
                advisorId: 'advisor-001',
                authorId: 'advisor-001',
                content: 'Bonjour Pierre, je suis désolée d\'apprendre cela. Pouvez-vous me donner plus de détails ?',
                readStatus: ReadStatusEnum.READ,
                sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000)
            },
            {
                id: 'msg-007',
                conversationId: 'conv-002',
                clientId: 'client-002',
                advisorId: 'advisor-001',
                authorId: 'client-002',
                content: 'Ma carte a été refusée ce matin alors que j\'ai des fonds suffisants.',
                readStatus: ReadStatusEnum.READ,
                sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000)
            },
            {
                id: 'msg-008',
                conversationId: 'conv-002',
                clientId: 'client-002',
                advisorId: 'advisor-001',
                authorId: 'advisor-001',
                content: 'Je vais vérifier cela immédiatement. Il se peut que votre carte ait été temporairement bloquée pour des raisons de sécurité.',
                readStatus: ReadStatusEnum.READ,
                sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'msg-009',
                conversationId: 'conv-002',
                clientId: 'client-002',
                advisorId: 'advisor-001',
                authorId: 'advisor-001',
                content: 'Tout est résolu ! Votre carte est de nouveau active.',
                readStatus: ReadStatusEnum.UNREAD,
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
                readStatus: ReadStatusEnum.READ,
                sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'msg-011',
                conversationId: 'conv-003',
                clientId: 'client-001',
                advisorId: 'advisor-002',
                authorId: 'advisor-002',
                content: 'Bonjour Marie ! Pas de problème. Vers quel pays souhaitez-vous effectuer ce virement ?',
                readStatus: ReadStatusEnum.READ,
                sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000)
            },
            {
                id: 'msg-012',
                conversationId: 'conv-003',
                clientId: 'client-001',
                advisorId: 'advisor-002',
                authorId: 'client-001',
                content: 'Vers l\'Espagne, pour un montant de 5000€.',
                readStatus: ReadStatusEnum.UNREAD,
                sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            }
        ];

        for (const msg of messages) {
            const messageEntity = MessageEntity.from(
                msg.id,
                msg.conversationId,
                msg.clientId,
                msg.advisorId,
                msg.authorId,
                msg.content,
                msg.readStatus,
                msg.sentAt
            );

            if (!(messageEntity instanceof Error)) {
                await messageRepository.save(messageEntity);
            }
        }

        console.log(`  ✓ Created ${messages.length} messages`);
        console.log('✅ Messages created\n');


        console.log('👥 Creating group conversations...');

        const groupConversations = [
            {
                id: randomUUID(),
                name: 'Équipe Commerciale',
                createdBy: 'manager-001',
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
            },
            {
                id: randomUUID(),
                name: 'Support Client',
                createdBy: 'manager-001',
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
            }
        ];

        for (const group of groupConversations) {
            const groupEntity = GroupConversationEntity.from(
                group.id,
                group.name,
                group.createdBy,
                group.createdAt,
                group.createdAt
            );

            if (!(groupEntity instanceof Error)) {
                await groupConversationRepository.create(groupEntity);
                console.log(`  ✓ Created group: ${group.name}`);
            }
        }

        console.log('✅ Group conversations created\n');


        console.log('👤 Adding group participants...');

        const groupParticipants = [
            // Group 1 participants
            { groupId: groupConversations[0]?.id, userId: 'manager-001', role: RoleEnum.BANK_MANAGER },
            { groupId: groupConversations[0]?.id, userId: 'advisor-001', role: RoleEnum.BANK_ADVISOR },
            { groupId: groupConversations[0]?.id, userId: 'advisor-002', role: RoleEnum.BANK_ADVISOR },
            
            // Group 2 participants
            { groupId: groupConversations[1]?.id, userId: 'manager-001', role: RoleEnum.BANK_MANAGER },
            { groupId: groupConversations[1]?.id, userId: 'advisor-001', role: RoleEnum.BANK_ADVISOR }
        ];


        for (const participant of groupParticipants) {
            if (!participant.groupId) {
                console.error(`  ❌ Error: groupId is undefined for participant with userId ${participant.userId}`);
                continue;
            }
            const participantEntity = GroupParticipantEntity.from(
                randomUUID(),
                participant.groupId,
                participant.userId,
                participant.role,
                new Date()
            );

            if (!(participantEntity instanceof Error)) {
                await groupParticipantRepository.addParticipant(participantEntity);
            }
        }

        console.log(`  ✓ Added ${groupParticipants.length} participants`);
        console.log('✅ Group participants added\n');

     
        console.log('💬 Creating group messages...');

        const groupMessages = [
            // Group 1 messages
            {
                groupId: groupConversations[0]?.id,
                senderId: 'manager-001',
                senderRole: RoleEnum.BANK_MANAGER,
                senderFirstName: 'Jean',
                senderLastName: 'Dubois',
                content: 'Bonjour à tous ! Bienvenue dans le groupe Équipe Commerciale.',
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                readBy: ['manager-001', 'advisor-001', 'advisor-002']
            },
            {
                groupId: groupConversations[0]?.id,
                senderId: 'advisor-001',
                senderRole: RoleEnum.BANK_ADVISOR,
                senderFirstName: 'Sophie',
                senderLastName: 'Bernard',
                content: 'Merci Jean ! Hâte de collaborer avec vous tous.',
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
                readBy: ['manager-001', 'advisor-001', 'advisor-002']
            },
            {
                groupId: groupConversations[0]?.id,
                senderId: 'advisor-002',
                senderRole: RoleEnum.BANK_ADVISOR,
                senderFirstName: 'Lucas',
                senderLastName: 'Petit',
                content: 'Bonjour à tous ! Ravi de faire partie de l\'équipe.',
                createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
                readBy: ['manager-001', 'advisor-001']
            },
            {
                groupId: groupConversations[0]?.id,
                senderId: 'manager-001',
                senderRole: RoleEnum.BANK_MANAGER,
                senderFirstName: 'Jean',
                senderLastName: 'Dubois',
                content: 'Nous avons une réunion prévue demain à 10h pour discuter des objectifs du trimestre.',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                readBy: ['manager-001']
            },

            // Group 2 messages
            {
                groupId: groupConversations[1]?.id,
                senderId: 'manager-001',
                senderRole: RoleEnum.BANK_MANAGER,
                senderFirstName: 'Jean',
                senderLastName: 'Dubois',
                content: 'Groupe Support Client créé pour faciliter la communication.',
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                readBy: ['manager-001', 'advisor-001']
            },
            {
                groupId: groupConversations[1]?.id,
                senderId: 'advisor-001',
                senderRole: RoleEnum.BANK_ADVISOR,
                senderFirstName: 'Sophie',
                senderLastName: 'Bernard',
                content: 'Parfait ! J\'ai plusieurs questions de clients à partager.',
                createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
                readBy: ['manager-001', 'advisor-001']
            },
            {
                groupId: groupConversations[1]?.id,
                senderId: 'advisor-001',
                senderRole: RoleEnum.BANK_ADVISOR,
                senderFirstName: 'Sophie',
                senderLastName: 'Bernard',
                content: 'Un client demande des informations sur les prêts immobiliers. Quelqu\'un peut m\'aider ?',
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
                readBy: ['advisor-001']
            }
        ];

        for (const msg of groupMessages) {
            if (!msg.groupId) {
                console.error(`  ❌ Error: groupId is undefined for message`);
                continue;
            }
            const messageEntity = GroupMessageEntity.from(
                randomUUID(),
                msg.groupId,
                msg.senderId,
                msg.senderRole,
                msg.senderFirstName,
                msg.senderLastName,
                msg.content,
                msg.createdAt,
                msg.readBy
            );

            if (!(messageEntity instanceof Error)) {
                await groupMessageRepository.create(messageEntity);
            }
        }

        console.log(`  ✓ Created ${groupMessages.length} group messages`);
        console.log('✅ Group messages created\n');

   
        console.log('SUMMARY:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✓ ${testUsers.length} test users`);
        console.log(`✓ ${accounts.length} bank accounts (CHECKING)`);
        console.log(`✓ ${conversations.length} individual conversations`);
        console.log(`✓ ${messages.length} individual messages`);
        console.log(`✓ ${groupConversations.length} group conversations`);
        console.log(`✓ ${groupParticipants.length} group participants`);
        console.log(`✓ ${groupMessages.length} group messages`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('🎉 In-memory messaging fixtures loaded successfully!\n');
        console.log('⚠️  NOTE: These fixtures are loaded in memory and will be lost when the server restarts.\n');

    } catch (error) {
        console.error('❌ Error loading in-memory messaging fixtures:', error);
        throw error;
    }
}


if (import.meta.url === `file://${process.argv[1]}`) {
    loadInMemoryMessagingFixtures()
        .then(() => {
            console.log('✅ Process completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Process failed:', error);
            process.exit(1);
        });
}
