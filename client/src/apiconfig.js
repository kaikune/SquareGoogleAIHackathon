// apiConfig.js
export let BASE_URL = undefined;

if (process.env.ENV) {
    BASE_URL = 'https://backend-qoogfebxba-uc.a.run.app';
} else {
    BASE_URL = 'http://localhost:9000';
}

//export const BASE_URL = 'https://backend-qoogfebxba-uc.a.run.app';
