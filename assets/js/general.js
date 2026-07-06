$(function () {
    var href = window.location.href || '';
    if (href.match('/editor|/viewer|/preview')) {
        $(document).on("contextmenu", function (e) { e.preventDefault(); });
    }
});
function errorAvatar(element) {
    element.removeAttribute('onerror');
    element.src = 'assets/image/user-avatar-default.png';
}
function errorBoardCover(element) {
    element.removeAttribute('onerror');
    element.src = 'assets/image/no-image.svg';
}
function errorMediaCover(element) {
    element.removeAttribute('onerror');
    element.src = 'assets/image/no-board-default.jpg';
}