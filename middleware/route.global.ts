
// // 白名单列表，记录无需权限访问的所有页面
// const whiteList = ['/login', '/register']

// export default defineNuxtRouteMiddleware((to, from) => {
//   // 首页重定向
//   if (to.path === '/') {
//     return navigateTo('/login')
//   }
//   // 获取 token
//   // const token = localStorage.getItem('JWT')
//   const token=getToken()
//   if (!token && !whiteList.includes(to.path)) {
//     return navigateTo('/login')
//   }
// })
const whiteList = ['/login', '/register'];

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/') {
    return navigateTo('/login');
  }
  const token = getToken();
  console.log('Navigating to:', to.path);
  console.log('Token1:', token);
  if (!token && !whiteList.includes(to.path)) {
    console.log('No token, redirecting to login');
    return navigateTo('/login');
  }
});
