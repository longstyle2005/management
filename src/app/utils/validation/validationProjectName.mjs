'use client'
const REGEX_PROJECT_NAME = /^[A-Za-z0-9\-_.()\s]+$/;
const validationProjectName = (value, inputEle, errorEle) => {
    if(value){
        if( REGEX_PROJECT_NAME.test(value) ){
                inputEle.classList.remove('error');
                errorEle?.classList.remove('show');
                return true;
        } else {
            inputEle.classList.add('error');
            errorEle?.classList.add('show');
            errorEle.innerHTML = `Invalid project name`;
            return false;
        }
    } else {
        inputEle.classList.add('error');
        errorEle?.classList.add('show');
        errorEle.innerHTML = `Please enter name`;
        return false;
    }
}

export default validationProjectName;