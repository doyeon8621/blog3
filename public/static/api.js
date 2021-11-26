function getSelf(callback) {
  $.ajax({
    type: "GET",
    url: "/api/users/me",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      callback(response.user);
    },
    error: function (error) {
      alert(error.responseJSON.errorMessage);
      localStorage.clear();
      window.location.href = "/logins";
    },
  });
}
//로그아웃
function signOut() {
  localStorage.clear();
  window.location.href = "/";
}
