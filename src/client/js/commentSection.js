const videoContainer = document.querySelector("#videoContainer");
const commentForm = document.querySelector("#commentForm");
const commentList = document.querySelector(".video__comments ul");
const deleteBtnList = document.querySelectorAll(".video__comment--delete");

const deleteComment = async (event) => {
  const targetComment = event.target.parentElement;
  const commentId = targetComment.dataset.commentId;
  // delete in DB
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    // delete in HTML
    commentList.removeChild(targetComment);
  }
};

const addFakeComment = (text, id) => {
  const li = document.createElement("li");
  li.classList.add("video__comment");
  li.dataset.commentId = id;
  const i = document.createElement("i");
  i.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = "❌";
  deleteSpan.className = "video__comment--delete";
  deleteSpan.addEventListener("click", deleteComment);
  li.appendChild(i);
  li.appendChild(span);
  li.appendChild(deleteSpan);
  commentList.prepend(li);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = commentForm.querySelector("textarea");
  const videoId = videoContainer.dataset.videoId;
  const text = textarea.value;
  if (text.trim() === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  if (response.status === 201) {
    {
    }
    textarea.value = "";
    const { newCommentId } = await response.json();
    addFakeComment(text, newCommentId);
  }
};

if (commentForm) {
  commentForm.addEventListener("submit", handleSubmit);
}

if (deleteBtnList) {
  deleteBtnList.forEach((deleteBtn) =>
    deleteBtn.addEventListener("click", deleteComment)
  );
}
