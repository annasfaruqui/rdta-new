if (userLC) {
  user = JSON.parse(userLC);
  if (user.designation !== "super_admin") {
    window.location.replace("http://127.0.0.1:5500/client/index.html");
  }
}
if (!userLC) {
  window.location.replace("http://127.0.0.1:5500/client/index.html");
}
