import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../../app.js';
import { checkMessageExceedsLimit } from './helper.js';
import e from 'express';

// Create a new document with the given client ID and append the message to it
export async function createRecordAndAppendMessage(clientId, message) {
    try {
        const clientRef = db.collection('clients').doc(clientId);
        const clientDoc = await clientRef.get();

        // Check if the message exceeds the word limit
        if (checkMessageExceedsLimit(message)) {
            console.log("Message exceeds the word limit! Not appending to the document.");
            return;
        }

        // Initialize the document with an empty messages array if it doesn't exist
        if (!clientDoc.exists) {
            await clientRef.set({ messages: [] });
        }

        // Append the new message to the existing 'messages' array
        await clientRef.update({
            messages: FieldValue.arrayUnion(message)
        });

        console.log("Message appended to document with ID: ", clientId);
    } catch (error) {
        console.error("Error appending message: ", error);
    }
}

// Read the messages from the document with the given client ID
export async function readMessages(clientId) {
    try {
        const clientRef = db.collection('clients').doc(clientId);
        const clientDoc = await clientRef.get();

        if (clientDoc.exists) {
            return clientDoc.data().messages;
        } else {
            console.log("No such document!");
            return [];
        }
    } catch (error) {
        console.error("Error reading messages: ", error);
    }
}

// Read all client IDs from the 'clients' collection
export async function getAllClientIds() {
    try {
        const clientsCollection = db.collection('clients');
        const clientSnapshot = await clientsCollection.get();

        const clientIds = clientSnapshot.docs.map(doc => doc.id);

        return clientIds;
    } catch (error) {
        console.error("Error fetching client IDs:", error);
        return [];
    }
}

// Make a new document with the given client ID and registration token
export async function makeClientIdentity(clientId, nToken) {
    try {
        const clientRef = db.collection('identity').doc(clientId);
        await clientRef.set({ registrationToken: nToken });
        console.log("Client identity created for: ", clientId);
        return clientId;
    } catch (error) {
        console.error("Error creating client identity: ", error);
    }
}

// Read the registration token from the document with the given client ID
export async function getNotificationToken(clientId) {
    try {
        const identityRef = db.collection('identity').doc(clientId);
        const identityDoc = await identityRef.get();

        if (identityDoc.exists) {
            return identityDoc.data().registrationToken;
        } else {
            console.log("No such document!");
            return [];
        }
    } catch (error) {
        console.error("Error reading token: ", error);
    }
}

// Make a new document with given client id for notifications
export async function makeClientNotification(clientId, notification, read, title) {
    try {
        const clientRef = db.collection('notifications').doc(clientId);
        const notificationData = {
            notification: notification,
            read: read,
            title: title
        }

        if (!clientRef.exists) {
            await clientRef.set({ responses: [] });
        }

        // Fetch the existing notifications document
        const clientDoc = await clientRef.get();

        // Get the existing responses array 
        let responses = clientDoc.data().responses;

        // Limit the size of the array
        if (responses.length >= 50) {
            responses.shift(); // Remove the oldest notificationData
        }

        // Add the new notification at the end
        responses.push(notificationData);

        // Update the document
        await clientRef.update({
            responses: responses
        });

        console.log("Client notification created for: ", clientId);
        return clientId;
    } catch (error) {
        console.error("Error creating client notification: ", error);
    }
}

// Read the notifications from the document with the given client ID
export async function readNotifications(clientId) {
    try {
        const clientRef = db.collection('notifications').doc(clientId);
        const clientDoc = await clientRef.get();

        if (clientDoc.exists) {
            return clientDoc.data().responses;
        } else {
            console.log("No such document!");
            return [];
        }
    } catch (error) {
        console.error("Error reading notifications: ", error);
    }
}

// Mark the notification as read
export async function markNotificationAsRead(clientId, index) {
    try {
        const clientRef = db.collection('notifications').doc(clientId);
        const clientDoc = await clientRef.get();

        if (clientDoc.exists) {
            let responses = clientDoc.data().responses;
            responses[index].read = true;

            await clientRef.update({
                responses: responses
            });
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error marking notification as read: ", error);
    }
}
