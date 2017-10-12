import { createAction } from 'redux-actions';

const ENTITY = "APP";

export const init = createAction(`${ENTITY}_INIT`);
export const ready = createAction(`${ENTITY}_READY`);