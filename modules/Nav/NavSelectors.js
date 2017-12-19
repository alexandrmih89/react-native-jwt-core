const localState = ({ nav }) => nav;

export const canGoBack = (state) => {
  const nav = localState(state);
  return nav.routes && nav.routes[0] && nav.routes[0].index > 0;
};
