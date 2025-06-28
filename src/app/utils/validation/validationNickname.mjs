'use client'
const REGEX_NAME = /^[a-zA-Z ]*$/;
const validationNickname = (value, inputEle, errorEle) => {
    if(value){
        if( REGEX_NAME.test(value) ){
                inputEle.classList.remove('error');
                errorEle?.classList.remove('show');
                return true;
        } else {
            inputEle.classList.add('error');
            errorEle?.classList.add('show');
            errorEle.innerHTML = `Invalid name`;
            return false;
        }
    } else {
        inputEle.classList.add('error');
        errorEle?.classList.add('show');
        errorEle.innerHTML = `Please enter name`;
        return false;
    }
}

export default validationNickname;