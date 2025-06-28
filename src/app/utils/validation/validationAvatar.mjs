'use client'
const validationAvatar = (file, imageEle, errorEle) => {
    if (!file) {
        imageEle.classList.add('error');
        errorEle?.classList.add('show');
        errorEle.textContent = 'Please select employee avatar';
        return false;
    }
  
    // Check type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
        imageEle.classList.add('error');
        errorEle?.classList.add('show');
        errorEle.textContent = 'Invalid image. Please select only .jpeg, .png, or .gif files.';
        return false;
    }
  
    // Check size
    const maxSizeInBytes = 10 * 1024;
    if (file.size > maxSizeInBytes) {
        imageEle.classList.add('error');
        errorEle?.classList.add('show');
        errorEle.textContent = 'Image too large. Maximum allowed size is 10kb';
        return false;
    }

    imageEle.classList.remove('error');
    errorEle?.classList.remove('show');
    return true;
}

export default validationAvatar;


    
