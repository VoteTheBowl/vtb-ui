import { defineParams } from '@sveltejs/kit/params';

const matchDev = (param: string) => {
	return !import.meta.env.PROD && param.includes('dev');
};

export const params = defineParams({
	dev: (param) => (matchDev(param) ? param : undefined)
});
