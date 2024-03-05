import { CronJob } from 'cron';
import admin from 'firebase-admin';
import { getAllClientIds, getNotificationToken, readMessages } from './dbHelper.js';
import systemHandler from '../handlers/systemHandler.js';


export const knowledgeCron = () => {
    // cron scheduler // Every day at midnight
    const job = new CronJob('0 */3 * * * *', async () => {
        const clients = await getAllClientIds();

        clients.forEach(async (client) => {
            let formattedMessages = "";
            const messages = await readMessages(client);
            if (messages.length > 0) {
                messages.forEach((message) => {
                    formattedMessages += message + ", ";
                });
            }

            console.log(`Formatted Messages: ${formattedMessages}`);

            const response = await systemHandler(formattedMessages, client);

            const notificationToken = await getNotificationToken(client);
            console.log(`Notification Token: ${notificationToken}`);
            console.log(`Client Id: ${client}`);

            const message = {
                notification: {
                    title: 'Grab New Knowledge',
                    body: response,
                },
                token: notificationToken
            };
            try {
                await admin.messaging().send(message);
                console.log(`Notification sent to ${client}`);
            } catch (error) {
                console.error(`Error sending notification to ${client}:`, error);
            }
        });
    });
    job.start();

}

// if (messages) {
//     // Assume 'registrationToken' is stored in your client document
//     const registrationToken = clientDoc.data().registrationToken;

//     // Construct FCM message (adjust accordingly)
//     const message = {
//         notification: {
//             title: 'New Notifications',
//             body: 'You have unread messages',
//         },
//         token: registrationToken
//     };

//     try {
//         await messaging().send(message);
//         console.log(`Notification sent to ${clientId}`);
//     } catch (error) {
//         console.error(`Error sending notification to ${clientId}:`, error);
//     }
// }