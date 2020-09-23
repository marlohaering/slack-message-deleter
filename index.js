const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

const FETCH_SIZE = 200;
const arguments = process.argv;

if (arguments.length != 4) {
    console.log('store slack token in env variable "SLACK_TOKEN" and call like this: ./node index <userId> <channelId>');
    return 0;
}

const userId = arguments[2];
const channelId = arguments[3];

const deleteMessage = async (channel, ts) => {
    const res = await web.chat.delete({
        channel,
        ts,
        as_user: true
    });
    return res;
};

const getMessages = async (channel, cursor = null, limit = FETCH_SIZE) => {
    const res = await web.conversations.history({
        cursor,
        channel,
        limit
    }).catch((reason) => {
        console.error(`Channel ${channelId} not found`);
        process.exit(0);
    });
    const { messages } = res;
    const next_cursor = res.response_metadata.next_cursor;

    return {
        messages,
        next_cursor
    }

};

(async () => {

    let next_cursor = null;
    let messages = [];

    while (true) {
        let res = await getMessages(channelId, next_cursor);
        messages = res.messages;
        next_cursor = res.next_cursor;

        console.log(`Fetched ${messages.length} comments`);

        for (const message of messages) {
            if (message.user === userId) {
                const res = await deleteMessage(channelId, message.ts);
                if (res.ok)
                    console.log(`Deleted: ${message.text}`);
                else
                    console.error(`Deletion failed: ${message.text}`);
            }
        }

        if (messages.length < FETCH_SIZE)
            break;
    }



})();