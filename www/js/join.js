function join() {
    const form = document.join_form;
    const chkUserid = checkValidUserid(form);
    const chkPw = checkValidPassword(form);
    const chkPw2 = checkValidPassword2(form);
    const chkUsername = checkValidUsername(form);

    if (chkUserid) {
        document.getElementById('alert_userid').innerText = "";
        form.userid.style.border = '2px solid';
        form.userid.style.borderColor = '#326CFF';
    } else {
        form.userid.style.border = '2px solid';
        form.userid.style.borderColor = '#FF0000';
        document.getElementById('alert_userid').style.color = '#FF0000';
    }

    if (chkPw) {
        document.getElementById('alert_password').innerText = "";
        form.password.style.border = '2px solid';
        form.password.style.borderColor = '#326CFF';
    } else {
        form.password.style.border = '2px solid';
        form.password.style.borderColor = '#FF0000';
        document.getElementById('alert_password').style.color = '#FF0000';
    }

    if (chkPw2) {
        document.getElementById('alert_password2').innerText = "";
        form.password2.style.border = '2px solid';
        form.password2.style.borderColor = '#326CFF';
    } else {
        form.password2.style.border = '2px solid';
        form.password2.style.borderColor = '#FF0000';
        document.getElementById('alert_password2').style.color = '#FF0000';
    }

    if (chkUsername) {
        document.getElementById('alert_username').innerText = "";
        form.username.style.border = '2px solid';
        form.username.style.borderColor = '#326CFF';
    } else {
        form.username.style.border = '2px solid';
        form.username.style.borderColor = '#FF0000';
        document.getElementById('alert_username').style.color = '#FF0000';
    }

    if (chkUserid && chkPw && chkPw2 && chkUsername) {
        console.log('complete. form.submit();');
    }
}

function checkValidUserid(form) {
    if (form.userid.value == "") {
        document.getElementById('alert_userid').innerText = "아이디를 입력하세요.";
        return false;
    }
    return true;
}

function checkValidPassword(form) {
    if (form.password.value == "") {
        document.getElementById('alert_password').innerText = "비밀번호를 입력하세요.";
        return false;
    }

    const pw = form.password.value;
    const num = pw.search(/[0-9]/g);
    const eng = pw.search(/[a-z]/ig);
    const spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    if (pw.length < 6) {
        // 최소 6문자 이상 입력
        document.getElementById('alert_password').innerText = "6자리 이상 입력하세요.";
        return false;
    } else if (pw.search(/\s/) != -1) {
        // 공백은 안됨
        document.getElementById('alert_password').innerText = "공백을 제거해주세요.";
        return false;
    } else if (num < 0 && eng < 0 && spe < 0) {
        // 이외 문자열 입력 방지
        document.getElementById('alert_password').innerText = "비밀번호가 올바르지 않습니다.";
        return false;
    }

    return true;
}

function checkValidPassword2(form) {
    if (form.password2.value == "") {
        document.getElementById('alert_password2').innerText = "비밀번호를 재입력하세요.";
        return false;
    }

    if (form.password.value !== form.password2.value) {
        document.getElementById('alert_password2').innerText = "비밀번호가 일치하지 않습니다.";
        form.password.style.border = '2px solid';
        form.password.style.borderColor = '#FF0000';
        document.getElementById('alert_password').style.color = '#FF0000';
        return false;
    }
    return true;
}

function checkValidUsername(form) {
    if (form.username.value == "") {
        document.getElementById('alert_username').innerText = "닉네임을 입력하세요.";
        return false;
    }
    return true;
}

/*이메일 체크 */
// function checkValidEmail(form) {
//     if (form.email.value == "") {
//         document.getElementById('alert_email').innerText = "이메일을 입력하세요.";
//         return false;
//     }

//     const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

//     // 이메일 형식 검사
//     if (exptext.test(form.email.value) === false) {
//         document.getElementById('alert_email').innerText = "이메일 형식으로 입력하세요.";
//         return false;
//     }
//     return true;
// }
