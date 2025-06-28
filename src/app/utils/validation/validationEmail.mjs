'use client'
const REGEX_MEMBER_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const validationEmail = (value, inputEle, errorEle) => {
    if(value){
        if( REGEX_MEMBER_EMAIL.test(value) ){
            inputEle.classList.remove('error');
            errorEle?.classList.remove('show');
            return true;
        } else {
            inputEle.classList.add('error');
            errorEle?.classList.add('show');
            errorEle.innerHTML = `Invalid email`;
            return false;
        }
    } else {
        inputEle.classList.add('error');
        errorEle?.classList.add('show');
        errorEle.innerHTML = `Please enter email`;
        return false;
    }
}

export default validationEmail;
