// const KEY = 'key'

// // 获取
// export const getToken = () => {
//   return useCookie(KEY).value
// }

// // 设置
// export const setToken = (newToken: string) => {
//   useCookie(KEY, { maxAge: 60 * 60 * 24 * 14 }).value = newToken
// }

// // 删除
// export const delToken = () => {
//   useCookie(KEY).value = undefined
// }

const KEY = 'key';

// 获取
export const getToken = () => {
  const token = useCookie(KEY).value;

  return token;
};

// 设置
export const setToken = (newToken:any) => {
  useCookie(KEY, { maxAge: 60 * 60 * 24 * 14 }).value = newToken;

};

// 删除
export const delToken = () => {
  useCookie(KEY).value = undefined;

};
