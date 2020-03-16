const host = SERVER;
const opts = {mode: 'cors', credentials: 'include'};

function easyFetch(method, path, extraOpts) {
  const finalOpts = Object.assign({method}, opts, extraOpts);

  return fetch(host + path, finalOpts)
    .then(res => res.json());
}

export const get = function (path) {
  return easyFetch('GET', path);
};

export const post = function (path, extraOpts = {}) {
  return easyFetch('POST', path, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...extraOpts
  });
};
