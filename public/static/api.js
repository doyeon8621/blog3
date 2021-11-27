//로그인 되어있는지 확인하고 아니면 로그인 페이지로 보낸다.
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
      if (error.status == 401) {
        window.location.href = "/logins";
      }
      localStorage.clear();
    },
  });
}
//로그아웃
function signOut() {
  localStorage.clear();
  window.location.href = "/";
}
//로그인 버튼 혹은 로그아웃 버튼을 그린다
function log_in_or_out() {
  let temp_html = "";
  if (localStorage.getItem("token")) {
    temp_html = `<li class="nav-item" id="link-logout">
    <a class="nav-link" data-toggle="modal" data-target="#signOutModal">
      로그아웃<i class="fa fa-sign-out ml-2" aria-hidden="true"></i>
    </a>
    <div
      class="modal text-left"
      id="signOutModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="signOutModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="signOutModalLabel">로그아웃</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            정말로 로그아웃 하시겠습니까?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-sparta"
              data-dismiss="modal"
            >
              취소
            </button>
            <button
              type="button"
              class="btn btn-sparta"
              onclick="signOut()"
            >
              로그아웃하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </li>`;
  } else {
    temp_html = `<li class="nav-item" id="link-login">
  <a class="nav-link"  href="/logins">
    로그인
  </a></li>`;
  }
  $("#buttonBar").append(temp_html);
}
