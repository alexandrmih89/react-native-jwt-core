import { createAction } from 'redux-actions';

const ENTITY = 'Nav';

export const goTo = createAction(`${ENTITY}/to`);
export const goBack = createAction(`${ENTITY}/back`);
export const resetTo = createAction(`${ENTITY}/reset`);
export const setParams = createAction(`${ENTITY}/set_params`);

export const login = createAction(`${ENTITY}/login`);
export const logout = createAction(`${ENTITY}/logout`);
export const register = createAction(`${ENTITY}/register`);