module.exports = {
    apps: [
        {
            name: 'Restaurant Api Service',
            script: 'dist/index.js',
            watch: false,
            env: {
                NODE_ENV: 'development',
                DEBUG: 'true',
            },
            env_production: {
                NODE_ENV: 'production',
                DEBUG: 'false',
            },
        },
    ],
};
