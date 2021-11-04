const httpStatus = require('http-status-codes');
const logger = require('../config/logger')
exports.pageNotFoundError = (req, res) => { // 404 error 처리
    var errCode = httpStatus.NOT_FOUND;
    logger.error(errCode);
    if (req.session.user_info == undefined) res.send('<script type="text/javascript">alert("페이지를 찾을 수 없습니다.");window.location.href="/index"</script>');
    else res.send('<script type="text/javascript">alert("페이지를 찾을 수 없습니다.");window.location.href="/profile"</script>');

}
exports.respondInternalError = (errors, req, res, next) => { //500 에러 처리
    var errCode = httpStatus.INTERNAL_SERVER_ERROR;
    res.status(errCode);
    logger.error(errCode);
    if (req.session.user_info == undefined) res.send('<script type="text/javascript">alert("서버 응답에 문제가 생겼습니다.");window.location.href="/index"</script>');
    else res.send('<script type="text/javascript">alert("서버 응답에 문제가 생겼습니다.");window.location.href="/profile"</script>');
}