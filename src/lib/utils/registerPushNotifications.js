import * as Permissions from 'expo-permissions';
import { apiRequest } from "../api/api";

const PUSH_ENDPOINT = 'https://quickcredit.com.ng/test/api/me/details/pushtoken';

async function registerForPushNotificationsAsync(username, token) {
    // const {status: existingStatus} = await Permissions.getAsync(
    //     Permissions.NOTIFICATIONS
    // );
    //
    // let finalStatus = existingStatus;
    //
    // // only ask if permissions have not already been determined, because
    // // iOS won't necessarily prompt the user a second time.
    // if (existingStatus !== 'granted') {
    //     // Android remote notification permissions are granted during the app
    //     // install, so this will only ask on iOS
    //     const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //     finalStatus = status;
    // }
    //
    // // Stop here if the user did not grant permissions
    // if (finalStatus !== 'granted') {
    //     return;
    // }


    // POST the token to your backend server from where you can retrieve it to send push notifications.

    apiRequest(PUSH_ENDPOINT, 'patch', {
        "username": username,
        "push_token": token
    }).then(res => {
        console.log(res)
    })
        .catch(err => {
            console.log(err)

        });
}

export  {registerForPushNotificationsAsync};
