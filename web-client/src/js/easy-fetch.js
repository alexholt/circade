const host = SERVER;
const opts = {mode: 'cors', credentials: 'include'};

function easyFetch(method, path, extraOpts) {
  const finalOpts = Object.assign({method}, opts, extraOpts);
  if (finalOpts.hasOwnProperty('body')) finalOpts.body = JSON.stringify(finalOpts.body);

  return fetch(host + path, finalOpts)
    .then(res => res.json());
}

export const get = function (path) {
  return easyFetch('GET', path);
};

export const del = function (path) {
  return easyFetch('DELETE', path);
};

export const put = function (path, extraOpts) {
  return easyFetch('PUT', path, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...extraOpts
  });
};

export const post = function (path, extraOpts = {}) {
  return easyFetch('POST', path, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...extraOpts
  });
};
