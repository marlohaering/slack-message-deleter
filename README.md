# slack-message-deleter

Deletes all messages in a slack channel of a specific user.

Usage:
- create a new slack app with `chat:write` and `im:history` permissions and install to your workspace
- copy and store slack token in env variable "SLACK_TOKEN"
- `npm install`
- call like this: `node main.js <userId> <channelId>`