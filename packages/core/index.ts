export function event() {
  const map = new Map();
  const set = (key) => map.get(key) || map.set(key, new Set()).get(key);
  const ret = obj((key, ..._) => set(key).forEach((l) => l(ret, ..._)));
  ret.mount = obj((key, fun) => set(key).add(fun));
  ret.clean = obj((key, fun) => set(key).delete(fun));
  return ret;
}

function obj(fun = () => {}) {
  return (target, ...args) => {
    if (typeof target === "string") fun(target, ...args);
    else for (const key in target) fun(key, target[key]);
  };
}