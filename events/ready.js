module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log("Ready!");
        client.user.setPresence({
            activities: [{ name: "DM me for help" }],
        });
        if (!client.guilds) {
            console.error("Client guilds not available.");
            return;
        }

        const user = client.users.cache.find(u=> u.id = '766574486425567234')
        if (user) {
            user.send('I am ready!').catch(console.error)
        } else { console.error('User not found')  } 
    },
};