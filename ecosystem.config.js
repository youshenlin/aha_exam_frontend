module.exports = {
    apps: [
        {
            name: 'aha-frontend',
            script: 'npm',
            args: 'start',
            interpreter: '/home/ec2-user/.nvm/versions/node/v20.12.2/bin/node',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
