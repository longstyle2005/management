'use client'
const validationLogo = (file, imageEle, errorEle) => {

    // Check type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
        imageEle.classList.add('error');
        errorEle?.classList.add('show');
        errorEle.textContent = 'Invalid logo. Please select only .jpeg, .png , .gif or .svg';
        return false;
    }
  
    // Check size
    const maxSizeInBytes = 10 * 1024;
    if (file.size > maxSizeInBytes) {
        imageEle.classList.add('error');
        errorEle?.classList.add('show');
        errorEle.textContent = 'Logo too large. Maximum allowed size is.';
        return false;
    }

    imageEle.classList.remove('error');
    errorEle?.classList.remove('show');
    return true;
}

export default validationLogo;


    
